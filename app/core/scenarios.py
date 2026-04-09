from __future__ import annotations

SCENARIOS = {
    "weather-ramp": {
        "key": "weather-ramp",
        "title": "极端天气下的调频调价",
        "brief": "强降温预警触发市场报价、运行优化与安全边界协同计算。",
        "prompt_hint": "15 分钟后强降温，负荷将上升，现货电价上涨 200%",
        "effects": {
            "margin": 18.4,
            "load": 12.5,
            "safety": -0.8,
            "carbon": 0.018,
            "asset_health": -1.3,
        },
        "semantic_events": [
            {
                "path": "PowerPlant/Region/Weather/ColdWaveForecast",
                "value": -6.0,
                "unit": "degC",
                "confidence": 0.96,
                "summary": "区域寒潮预警升级，预计 15 分钟内到达。"
            },
            {
                "path": "PowerPlant/Unit1/Market/SpotPriceForecast",
                "value": 2.0,
                "unit": "x",
                "confidence": 0.91,
                "summary": "现货价格预估上涨至当前水平的 2.0 倍。"
            },
            {
                "path": "PowerPlant/Unit1/Boiler/Sootblowing/RecommendedInterval",
                "value": 18,
                "unit": "min",
                "confidence": 0.88,
                "summary": "为保障升负荷窗口，建议缩短吹灰间隔。"
            },
        ],
        "steps": [
            {
                "offset_ms": 0,
                "agent": "Orchestrator",
                "title": "拆解跨域任务",
                "summary": "识别为经营与生产联动任务，拆解为现货报价、负荷提升、约束校核三个子任务。",
                "semantic_subgraph": [
                    "ColdWaveForecast -> LoadForecast",
                    "SpotPriceForecast -> BidCurveUpdate",
                    "LoadRamp -> SafetyBoundaryCheck",
                ],
            },
            {
                "offset_ms": 1400,
                "agent": "Market Strategist",
                "title": "生成报价策略",
                "summary": "基于电价预测与边际成本曲线，建议在 14:00 前上修报价并抢占高价出清时段。",
                "semantic_subgraph": [
                    "FuelCost + CarbonCost -> MarginalCost",
                    "MarginalCost + SpotPriceForecast -> BidCurve",
                ],
            },
            {
                "offset_ms": 3000,
                "agent": "Optimizer",
                "title": "校核满负荷约束",
                "summary": "测算热耗、减温水开度和吹灰频率，给出效率与可行性边界。",
                "semantic_subgraph": [
                    "LoadRamp -> BoilerEfficiency",
                    "BoilerEfficiency -> DesuperheatingWindow",
                ],
            },
            {
                "offset_ms": 4700,
                "agent": "Compliance Officer",
                "title": "执行安全边界复核",
                "summary": "核查火焰稳定性和运行票约束，确认可以在风控阈值内执行负荷爬坡。",
                "semantic_subgraph": [
                    "LoadRamp -> FlameStability",
                    "FlameStability -> PermitConstraints",
                ],
            },
            {
                "offset_ms": 6400,
                "agent": "Orchestrator",
                "title": "形成协同共识",
                "summary": "汇总收益、效率和安全三方观点，输出平衡后的联合策略。",
                "semantic_subgraph": [
                    "BidCurve + BoilerEfficiency + PermitConstraints -> ConsensusPlan",
                ],
            },
        ],
        "recommendation": {
            "headline": "建议在 14:00 前提升至满负荷，并同步更新报价曲线。",
            "summary": "预计边际收益增加 5.2 万元，热耗抬升可控，需将吹灰间隔缩短至 18 分钟并强化减温水监视。",
            "owner": "主编排智能体",
        },
        "tradeoffs": [
            "收益优先会带来轻微的碳强度上升。",
            "升负荷窗口受锅炉吹灰策略和减温水开度约束。",
            "安全边界允许执行，但要求值长持续监视火焰稳定性。",
        ],
        "causal_chain": [
            {
                "title": "寒潮预警",
                "detail": "区域气象智能体发布降温预测，居民采暖负荷即将上冲。"
            },
            {
                "title": "价格抬升",
                "detail": "现货价格预测模型识别到高价出清窗口。"
            },
            {
                "title": "生产约束",
                "detail": "性能智能体发现满负荷前必须调整吹灰节奏。"
            },
            {
                "title": "协同决策",
                "detail": "经营与运行联合给出既抢收益又守边界的调度方案。"
            },
        ],
    },
    "asset-clinic": {
        "key": "asset-clinic",
        "title": "设备隐患数字医生",
        "brief": "轴承高频振动触发故障门诊，联动历史案例与检修准备。",
        "prompt_hint": "1 号泵 A 轴承出现高频振动，帮我判断风险并安排处理",
        "effects": {
            "margin": -3.8,
            "load": -5.4,
            "safety": 0.5,
            "carbon": 0.006,
            "asset_health": -9.6,
        },
        "semantic_events": [
            {
                "path": "PowerPlant/Unit1/Pumps/PumpA/Bearing/Vibration",
                "value": 4.8,
                "unit": "mm/s",
                "confidence": 0.94,
                "summary": "A 轴承高频振动超过近期健康基线。"
            },
            {
                "path": "PowerPlant/Unit1/Pumps/PumpA/Bearing/TemperatureRise",
                "value": 6.4,
                "unit": "degC",
                "confidence": 0.9,
                "summary": "温升轻微，指向早期劣化而非急性失效。"
            },
            {
                "path": "PowerPlant/Unit1/Maintenance/RecommendedWindow",
                "value": 22,
                "unit": "hour",
                "confidence": 0.89,
                "summary": "建议在明晚低谷窗口停机检查。"
            },
        ],
        "steps": [
            {
                "offset_ms": 0,
                "agent": "Asset Guardian",
                "title": "识别亚健康特征",
                "summary": "对比五年健康画像后，确认振动频谱偏离正常工况，不建议仅作为普通报警处理。",
                "semantic_subgraph": [
                    "VibrationSpectrum -> HealthScore",
                    "HealthScore -> ClinicTask",
                ],
            },
            {
                "offset_ms": 1500,
                "agent": "Orchestrator",
                "title": "发起联合门诊",
                "summary": "组织故障诊断、检修计划和经营影响评估，避免孤立处理设备告警。",
                "semantic_subgraph": [
                    "ClinicTask -> RetrievalPlan",
                    "ClinicTask -> MaintenanceWindowPlan",
                ],
            },
            {
                "offset_ms": 3200,
                "agent": "Asset Guardian",
                "title": "回看历史证据",
                "summary": "检索去年大修报告、同型设备厂家通报和 5 年运行记录，锁定密封受损可能性最高。",
                "semantic_subgraph": [
                    "RepairReport + VendorNotice -> RootCauseHypothesis",
                ],
            },
            {
                "offset_ms": 5000,
                "agent": "Optimizer",
                "title": "评估检修窗口",
                "summary": "结合下周负荷曲线与备用能力，建议在明晚低谷时段安排停机检查，兼顾可用率与风险。",
                "semantic_subgraph": [
                    "LoadCurve + ReserveMargin -> MaintenanceWindow",
                ],
            },
            {
                "offset_ms": 6700,
                "agent": "Compliance Officer",
                "title": "生成作业准备包",
                "summary": "自动整理备件申领、作业风险点和检修前置条件，形成可执行工单建议。",
                "semantic_subgraph": [
                    "MaintenanceWindow + PermitRules -> WorkPackage",
                ],
            },
        ],
        "recommendation": {
            "headline": "建议在明晚低谷窗口停机检查 1 号泵 A 轴承，并提前准备密封组件。",
            "summary": "诊断结果高度符合密封受损引起的湍流波动，若延后处理，下周高峰期间可用率风险将显著上升。",
            "owner": "设备健康智能体",
        },
        "tradeoffs": [
            "提前检修会牺牲短时负荷输出，但能避免高峰时段非计划停机。",
            "当前风险仍处于可控区间，适合做计划性而非抢修式处理。",
            "需要提前锁定备件与检修人员，保证窗口期内一次完成。"
        ],
        "causal_chain": [
            {
                "title": "振动偏离",
                "detail": "感知层捕捉到高频振动特征，明显偏离该轴承健康基线。"
            },
            {
                "title": "证据检索",
                "detail": "历史检修记录与厂家通报均指向密封受损可能。"
            },
            {
                "title": "经营影响",
                "detail": "若在高峰窗口发生扩展故障，将导致更高的边际损失。"
            },
            {
                "title": "计划性处置",
                "detail": "系统建议在低谷窗口检修，并自动准备备件与风险控制包。"
            },
        ],
    },
}
