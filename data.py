import pandas as pd
import numpy as np

def load_data(file_path):
    # Load Excel sheets
    df_demand = pd.read_excel(file_path, sheet_name='ClinkerDemand')
    df_cap = pd.read_excel(file_path, sheet_name='ClinkerCapacity')
    
    # Process Demand
    # I = all IU_xxx codes (producers)
    # J = all GU_xxx codes (consumers)
    ius = df_cap['IU CODE'].unique().tolist()
    gus = [c for c in df_demand['IUGU CODE'].unique() if c not in ius]
    plants = ius + gus
    time_periods = sorted(df_demand['TIME PERIOD'].unique().tolist())
    modes = ['Road', 'Rail']
    
    # Create demand dict: demand[plant][t]
    demand = {}
    for _, row in df_demand.iterrows():
        p = row['IUGU CODE']
        t = row['TIME PERIOD']
        d = row['DEMAND']
        if p not in demand: demand[p] = {}
        demand[p][t] = d
        
    # Create capacity and prod cost dicts
    cap = df_cap.set_index('IU CODE')['CAPACITY'].to_dict()
    c_prod = df_cap.set_index('IU CODE')['PRODUCTION COST'].to_dict()
    
    # Generate transport costs (c_trans[i, j, m])
    # For demo: base cost + distance factor
    c_trans = {}
    for i in ius:
        for j in plants:
            if i == j: continue
            # Road cost
            road_cost = np.random.randint(500, 1500)
            c_trans[(i, j, 'Road')] = road_cost
            # Rail cost (0.7x Road)
            c_trans[(i, j, 'Rail')] = int(0.7 * road_cost)
            
    # Holding costs & Safety Stock (Generated)
    c_hold = {k: 50 for k in plants}
    ss = {k: 50000 for k in plants}
    
    return {
        'ius': ius,
        'gus': gus,
        'plants': plants,
        'time_periods': time_periods,
        'modes': modes,
        'demand': demand,
        'cap': cap,
        'c_prod': c_prod,
        'c_trans': c_trans,
        'c_hold': c_hold,
        'ss': ss
    }

if __name__ == "__main__":
    data = load_data('Dataset_Dummy_Clinker_3MPlan.xlsx')
    print(f"Loaded {len(data['ius'])} IUs and {len(data['gus'])} GUs")
