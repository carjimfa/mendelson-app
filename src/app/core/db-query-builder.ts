export class DbQueryBuilder {
    query: string;
    conditions: string[];
    groupByColumn?: string;

    constructor() {
        this.query = '';
        this.conditions = [];
    }

    select(table: string, columns: Array<string> = ['*']): DbQueryBuilder {
        this.query = `SELECT ${columns.join(', ')} FROM ${table}`;
        return this;
    }

    insert(table: string, columns: Array<string>): DbQueryBuilder {
        this.query = `INSERT INTO ${table}`;

        if (columns.length) {
            this.query += `(${columns.join(', ')}) `;
        }

        this.query += `VALUES(${columns.map((c, i) => `$${i + 1}`)})`

        return this;
    }

    where(parameter: string, operator: string, value: unknown, ruleOperator: "OR" | "AND" = "AND"): DbQueryBuilder {
        if (!this.conditions.length) {
            this.conditions.push(`${parameter} ${operator} \'${value}\'`);
        } else {
            this.conditions.push(`${ruleOperator} ${parameter} ${operator} \'${value}\'`);
        }

        return this;
    }

    build(): string {
        if (this.conditions.length > 0) {
            this.query += ` WHERE ${this.conditions.join(' ')}`;
        }

        if (this.groupByColumn) {
            this.query += ` GROUP BY ${this.groupByColumn}`;
        }

        return this.query;
    }

    groupBy(column: string): DbQueryBuilder {
        this.groupByColumn = column;
        return this;
    }
}