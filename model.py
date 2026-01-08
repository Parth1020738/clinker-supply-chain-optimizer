from pulp import LpProblem, LpMinimize, LpVariable, lpSum, value, LpStatus
from data import load_data

def build_model(data, scenario='Base'):
    # Extract data
    ius = data['ius']
    plants = data['plants']
    time_periods = data['time_periods']
    modes = data['modes']
    demand = data['demand']
    cap = data['cap']
    c_prod = data['c_prod']
    c_trans = data['c_trans']
    c_hold = data['c_hold']
    ss = data['ss']
    
    # Adjust demand based on scenario
    adj_demand = {}
    multiplier = 1.0
    if scenario == '+10% Demand': multiplier = 1.1
    elif scenario == '-10% Demand': multiplier = 0.9
    
    for p in demand:
        adj_demand[p] = {t: demand[p][t] * multiplier for t in demand[p]}

    # Define Problem
    model = LpProblem("Clinker_Supply_Chain_Optimization", LpMinimize)

    # Decision Variables
    # p[i, t]: production at IU i in period t
    p_vars = LpVariable.dicts("Prod", [(i, t) for i in ius for t in time_periods], lowBound=0)
    
    # x[i, j, m, t]: tons shipped IU i -> plant j via mode m in period t
    x_vars = LpVariable.dicts("Ship", [(i, j, m, t) for i in ius for j in plants for m in modes for t in time_periods if i != j], lowBound=0)
    
    # I[k, t]: inventory at plant k end of period t
    i_vars = LpVariable.dicts("Inv", [(k, t) for k in plants for t in time_periods], lowBound=0)

    # Objective Function
    model += (
        lpSum(c_prod[i] * p_vars[i, t] for i in ius for t in time_periods) +
        lpSum(c_trans[i, j, m] * x_vars[i, j, m, t] for (i, j, m, t) in x_vars) +
        lpSum(c_hold[k] * i_vars[k, t] for k in plants for t in time_periods)
    )

    # Constraints
    for t in time_periods:
        # 1. Production capacity
        for i in ius:
            model += p_vars[i, t] <= cap[i], f"Cap_Constraint_{i}_{t}"
            
        # 2. Demand fulfillment & Inventory balance
        for k in plants:
            # Incoming shipments to k
            incoming = lpSum(x_vars[i, k, m, t] for i in ius for m in modes if (i, k, m, t) in x_vars)
            # Outgoing shipments from k (only if k is an IU)
            outgoing = lpSum(x_vars[k, j, m, t] for j in plants for m in modes if (k, j, m, t) in x_vars)
            
            # Production at k (only if k is an IU)
            prod_k = p_vars[k, t] if k in ius else 0
            
            # Previous inventory
            prev_inv = i_vars[k, t-1] if t > time_periods[0] else ss[k] # Assuming initial inventory = safety stock
            
            # Inventory balance
            model += prev_inv + prod_k + incoming - outgoing - adj_demand[k].get(t, 0) == i_vars[k, t], f"Inv_Balance_{k}_{t}"
            
            # 3. Safety Stock
            model += i_vars[k, t] >= ss[k], f"Safety_Stock_{k}_{t}"

    return model, p_vars, x_vars, i_vars

def solve_model(model):
    model.solve()
    return LpStatus[model.status]

def extract_results(model, p_vars, x_vars, i_vars, data):
    results = {
        'total_cost': value(model.objective),
        'production_plan': [],
        'shipment_plan': [],
        'inventory_trends': []
    }
    
    for (i, t), var in p_vars.items():
        if value(var) > 0:
            results['production_plan'].append({'IU': i, 'Month': t, 'Tons': value(var)})
            
    for (i, j, m, t), var in x_vars.items():
        val = value(var)
        if val > 0:
            cost = val * data['c_trans'].get((i, j, m), 0)
            results['shipment_plan'].append({'From': i, 'To': j, 'Mode': m, 'Month': t, 'Tons': val, 'Cost': cost})
            
    for (k, t), var in i_vars.items():
        results['inventory_trends'].append({'Plant': k, 'Month': t, 'Inventory': value(var)})
        
    return results

if __name__ == "__main__":
    data = load_data('Dataset_Dummy_Clinker_3MPlan.xlsx')
    model, p_vars, x_vars, i_vars = build_model(data)
    status = solve_model(model)
    print(f"Model Status: {status}")
    if status == 'Optimal':
        res = extract_results(model, p_vars, x_vars, i_vars, data)
        print(f"Total Cost: {res['total_cost']}")
