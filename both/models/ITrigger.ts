export var Operator = {
    IS: '$eq',
    ISNOT: '$ne',
    GT: '$gt',
    GTE: '$gte',
    LT: '$lt',
    LTE: '$lte'
}

export interface ICondition {
    path: string;
    expressionName: string;
    operator: string;
    value: any;
}

export interface ITrigger {
    endpoint: string;
    conditions: Array<ICondition>;
    actionName: string;
    active: boolean;
}