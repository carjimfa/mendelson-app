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

    where(parameter: string, operator: string, value: string | number | boolean | Date | null | undefined, ruleOperator: "OR" | "AND" = "AND"): DbQueryBuilder {
        if (!this.conditions.length) {
            this.conditions.push(`${parameter} ${operator} \'${this.escapeInput(value)}\'`);
        } else {
            this.conditions.push(`${ruleOperator} ${parameter} ${operator} \'${this.escapeInput(value)}\'`);
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

        console.log(this.query);
        return this.query;
    }

    groupBy(column: string): DbQueryBuilder {
        this.groupByColumn = column;
        return this;
    }

    escapeInput(value: string | number | boolean | Date | null | undefined): string | number | boolean | Date | null | undefined {
        switch (typeof value) {
            case "string":
                return value.replace("'", "''");
            default:
                return value;
        }
    }
}