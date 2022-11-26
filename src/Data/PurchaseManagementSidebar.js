
const PurchaseManagementSidebar = [
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
        title: 'Reports',
        iconClass: 'bi bi-file-text',
        path: null,
        subMenus: [
            {id: 2, title: 'Returns Histories', path: 'purchase-return-reports', roles: []},
            {id: 1, title: 'Invoice Histories', path: 'purchases-reports', roles: []},
        ],
       roles:[]
    }, {
        id: 2,
        title: 'Purchases',
        iconClass: 'bi bi-cart-plus',
        path: null,
        subMenus: [
            {id: 3, title: 'Return Invoices', path: 'purchases/return/invoices', roles: []},
            {id: 2, title: 'Invoices', path: 'purchases/invoices', roles: []},
            {id: 1, title: 'New Purchase', path: 'purchases/new', roles: []},
        ],
       roles:[]
    }, {
        id: 1,
        title: 'Suppliers',
        iconClass: 'bi bi-people',
        path: 'suppliers',
        roles: []
    },
]

export default PurchaseManagementSidebar;