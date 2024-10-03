interface AccountDTO{
    id: string;

    email :string;
    
    role? : RoleDTO;

    profile?: ProfileDTO;
}