import { TestBed } from "@angular/core/testing";
import { DbQueryBuilder } from "./db-query-builder";

describe('DbQueryBuilder', () => {
    let service: DbQueryBuilder;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new DbQueryBuilder();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('builds a select all users query', () => {
        const builder = service.select('users');
        builder.build();
        expect(builder.query).toBe('SELECT * FROM users');
    });

    it('builds a simple select user and mail from users query', () => {
        const builder = service.select('users', ['user', 'email']);
        builder.build();
        expect(builder.query).toBe('SELECT user, email FROM users');
    });

    it('builds a simple select user by id', () => {
        const id = 1;
        const builder = service
            .select('users')
            .where('id', '=', id);

        builder.build();
        expect(builder.query).toBe('SELECT * FROM users WHERE id = \'1\'');
    });

    it('builds a simple select user by email and password', () => {
        const email = 'email@email.com';
        const password = 'password';

        const builder = service
            .select('users')
            .where('email', '=', email)
            .where('password', '=', password);

        builder.build();
        expect(builder.query).toBe('SELECT * FROM users WHERE email = \'email@email.com\' AND password = \'password\'');
    });

    it('builds a simple select user by email and password', () => {
        const email = 'email@email.com';
        const email2 = 'email@gmail.com';

        const builder = service
            .select('users')
            .where('email', '=', email)
            .where('email', '=', email2, 'OR');

        builder.build();
        expect(builder.query).toBe('SELECT * FROM users WHERE email = \'email@email.com\' OR email = \'email@gmail.com\'');
    });

    it('insert user', () => {
        const builder = service
            .insert('users', ['email', 'password']);

        builder.build();
        expect(builder.query).toBe('INSERT INTO users(email, password) VALUES($1,$2)');
    });

    it('select group by', () => {
        const builder = service
            .select('users', ['username', 'MAX(email) as email'])
            .groupBy('username');

        builder.build();
        expect(builder.query).toBe('SELECT username, MAX(email) as email FROM users GROUP BY username');
    });

    it('commas handling', () => {
        const escaped = service.escapeInput('Where It\'$ At');
        expect(escaped).toBe('Where It\'\'$ At');
    });
});