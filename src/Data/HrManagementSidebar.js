

const HrManagementSidebar = [
    {
        id: 11,
        title: 'Home',
        iconClass: 'bi bi-house',
        path: '/',
        roles: []
    },
    {
        id: 111111,
        title: 'Dashboard',
        iconClass: 'bi bi-speedometer2',
        path: '/hr',
        roles: []
    },
   {
        id: 2,
        title: 'Employees',
        iconClass: 'bi bi-people',
        path: null,
        subMenus: [
            // {id: 5, title: 'Histories', path: '/purchases', roles: []},
            // {id: 4, title: 'Salary Review', path: 'employees/salary-reviews', roles: []},
            {id: 2, title: 'Current List', path: 'employees', roles: []},
            {id: 1, title: 'Create', path: 'employees/create', roles: []},
        ],
       roles:[]
    }, {
        id: 1,
        title: 'Designations',
        iconClass: 'bi bi-shop',
        path: 'designations',
        roles: []
    },
]

export default HrManagementSidebar;