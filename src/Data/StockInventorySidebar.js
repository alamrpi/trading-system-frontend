

const StockInventorySidebar = [
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
        path: 'stock-inventory',
        roles: []
    },
   {
        id: 3,
        title: 'Reports',
        iconClass: 'bi bi-cart-plus',
        path: null,
        subMenus: [
            {id: 2, title: 'Damage Reports', path: 'damages/reports', roles: []},
            {id: 1, title: 'Stock Reports', path: 'stocks/reports', roles: []},
        ],
       roles:[]
    },
    {
        id: 2,
        title: 'Stocks',
        iconClass: 'bi bi-cart-plus',
        path: null,
        subMenus: [
            {id: 2, title: 'Damage Histories', path: 'damages', roles: []},
            {id: 1, title: 'Current Stock', path: 'stocks', roles: []},
        ],
       roles:[]
    }, {
        id: 1,
        title: 'Stores',
        iconClass: 'bi bi-shop',
        path: 'stores',
        roles: []
    },
]

export default StockInventorySidebar;