export enum Permission{
    READ_ACCOUNT = 'account:read',
    CREATE_ACCOUNT = 'account:create',
    UPDATE_ACCOUNT = 'account:update',
    DELETE_ACCOUNT = 'account:delete',
    RESET_PASSWORD = 'account:reset-password',
    ASSIGN_ROLE = 'account:assign-role',
    // ...
    READ_ROLE = 'role:read',
    CREATE_ROLE = 'role:create',
    UPDATE_ROLE = 'role:update',
    DELETE_ROLE = 'role:delete',

    // Route
    READ_ROUTE = 'route:read',
    CREATE_ROUTE = 'route:create',
    UPDATE_ROUTE = 'route:update',
    DELETE_ROUTE = 'route:delete',

    // Point
    READ_POINT = 'point:read',
    UPDATE_POINT = 'point:update',
    CREATE_POINT = 'point:create',
    DELETE_POINT = 'point:delete',
}