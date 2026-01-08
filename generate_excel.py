import pandas as pd
import numpy as np

def generate_dummy_data():
    # 1. ClinkerDemand sheet
    # IUGU CODE | TIME PERIOD | DEMAND | MIN FULFILLMENT (%)
    ius = ['IU_001', 'IU_003', 'IU_011']
    gus = ['GU_001', 'GU_002', 'GU_005']
    time_periods = [1, 2, 3]
    
    demand_data = []
    for plant in ius + gus:
        for t in time_periods:
            demand = np.random.randint(100000, 300000)
            min_fulfillment = 100 if plant.startswith('IU') else 90
            demand_data.append([plant, t, demand, min_fulfillment])
            
    df_demand = pd.DataFrame(demand_data, columns=['IUGU CODE', 'TIME PERIOD', 'DEMAND', 'MIN FULFILLMENT (%)'])
    
    # 2. ClinkerCapacity sheet
    # IU CODE | CAPACITY | PRODUCTION COST
    cap_data = []
    for iu in ius:
        cap = 1000000 # Increased capacity to ensure feasibility
        cost = 1500 # per ton
        cap_data.append([iu, cap, cost])
        
    df_cap = pd.DataFrame(cap_data, columns=['IU CODE', 'CAPACITY', 'PRODUCTION COST'])
    
    # Write to Excel
    with pd.ExcelWriter('Dataset_Dummy_Clinker_3MPlan.xlsx', engine='openpyxl') as writer:
        df_demand.to_excel(writer, sheet_name='ClinkerDemand', index=False)
        df_cap.to_excel(writer, sheet_name='ClinkerCapacity', index=False)
    
    print("Dummy dataset created: Dataset_Dummy_Clinker_3MPlan.xlsx")

if __name__ == "__main__":
    generate_dummy_data()
