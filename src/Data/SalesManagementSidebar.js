
const SalesManagementSidebar = [
    {
        id: 1,
        title: 'Home',
        iconClass: 'bi bi-house',
        path: '/',
        roles: []
    },
    {
        id: 2,
        title: 'Dashboard',
        iconClass: 'bi bi-speedometer2',
        path: '/sales-management',
        roles: []
    },
    {
        id: 3,
        title: 'Reports',
        iconClass: 'bi bi-file-text',
        path: null,
        subMenus: [
            {id: 2, title: 'Sale Returns', path: 'reports/sale-return', roles: []},
            {id: 1, title: 'Sales', path: 'reports/sales', roles: []},
        ],
        roles:[]
    }, {
        id: 4,
        title: 'Sales',
        iconClass: 'bi bi-cart-plus',
        path: null,
        subMenus: [
            {id: 4, title: 'Return Invoices', path: 'sales/return/invoices', roles: []},
            {id: 3, title: 'Invoices', path: 'sales/invoices', roles: []},
            {id: 1, title: 'New Sales', path: 'sales/new', roles: []},
        ],
        roles:[]
    }, {
        id: 5,
        title: 'Customers',
        iconClass: 'bi bi-people',
        path: 'customers',
        roles: []
    },
]

export default SalesManagementSidebar;