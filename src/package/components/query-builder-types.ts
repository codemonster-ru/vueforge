export type QueryBuilderCombinator = 'and' | 'or';

export type QueryBuilderFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export type QueryBuilderOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'isEmpty'
    | 'isNotEmpty'
    | (string & {});

export interface QueryBuilderFieldOption {
    label: string;
    value: string | number | boolean;
}

export interface QueryBuilderField {
    key: string;
    label: string;
    type?: QueryBuilderFieldType;
    operators?: Array<QueryBuilderOperator>;
    options?: Array<QueryBuilderFieldOption>;
}

export interface QueryBuilderRuleNode {
    id: string;
    kind: 'rule';
    field: string;
    operator: QueryBuilderOperator;
    value: unknown;
}

export interface QueryBuilderGroupNode {
    id: string;
    kind: 'group';
    combinator: QueryBuilderCombinator;
    children: Array<QueryBuilderNode>;
}

export type QueryBuilderNode = QueryBuilderRuleNode | QueryBuilderGroupNode;
