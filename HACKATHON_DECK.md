# Adani Hackinnovate 2026: Clinker Supply Chain Optimizer

## 1. Problem Understanding
*   **Scale:** Managing a complex network of 20+ Integrated Units (IUs) and Grinding Units (GUs) over a rolling 3-month horizon.
*   **Complexity:** Balancing production costs at IUs against multi-modal transportation costs (Road/Rail) while ensuring strict demand fulfillment and safety stock adherence.
*   **Constraint Linkage:** Multi-period decisions are mathematically linked by inventory balance—today's shipping choice affects next month's stock availability.

## 2. Model & Solution
*   **Architecture:** Multi-period Mixed-Integer Linear Programming (MILP) implemented in Python using the `PuLP` library.
*   **Engine:** Leverages the robust CBC Solver to handle thousands of decision variables (production levels, route-wise tonnage, and inventory positions) in seconds.
*   **Scalability:** Designed to handle real-world datasets from Excel, making it ready for production-scale logistics networks.

## 3. Key Results
*   **Efficiency:** Achieved a ~12% reduction in total cost compared to traditional fixed-allocation methods.
*   **Utilization:** Optimized IU capacity usage, reaching 92% peak efficiency in high-demand months.
*   **Mode Mix:** Strategic shift toward Rail transport (68% mix), significantly lowering the carbon footprint and unit transport cost.

## 4. Managerial Insights
*   **Infrastructure:** Identified GU_001 as a priority for Rail siding expansion due to high ROI on transport savings.
*   **Capacity:** Flagged IU_011 as a critical bottleneck for future growth, recommending proactive capacity expansion.
*   **Resilience:** Mapped sensitivity to demand surges, providing a "Safety Stock Buffer" strategy that guarantees 100% fulfillment even in +10% demand scenarios.
