
const commonRoles = []

const AccountingSidebar = [
    {
        id: 7,
        title: 'Dashboard',
        iconClass: 'bi bi-speedometer2',
        path: '/',
        roles: []
    },
    {
        id: 6,
        title: 'Statements',
        iconClass: 'bi bi-card-text',
        path: null,
        subMenus: [
            {id: 1, title: 'Statement Of Cash Flow', path: 'statements/cash-flows', roles: []},
            {id: 2, title: 'Balance Sheet', path: 'statements/balance-sheet', roles: []},
            // {id: 2, title: 'Income Statement', path: '/suppliers', roles: []},
            {id: 3, title: 'Owner\'s Equity Statements', path: 'statements/owner-equity', roles: []}
        ],
        roles: []
    },
    {
        id: 5,
        title: 'Ledgers',
        iconClass: 'bi bi-file-text',
        path: null,
        subMenus: [
            {id: 4, title: 'Suppliers Ledger', path: 'ledgers/supplier', roles: []},
            {id: 3, title: 'Customer Ledger', path: 'ledgers/customer', roles: []},
            {id: 2, title: 'Investors Ledger', path: 'ledgers/investor', roles: []},
            {id: 1, title: 'Bank Account Ledger', path: 'ledgers/bank-account', roles: []},
        ],
        roles: []
    },
    {
        id: 4,
        title: 'Revenue & Expense',
        iconClass: 'bi bi-cash',
        path: null,
        subMenus: [
            {id: 3, title: 'Revenues / Expenses', path: 'revenue-expense', roles: []},
            {id: 1, title: 'Heads', path: 'heads', roles: []},
        ],
        roles: []
    },
    {
        id: 3,
        title: 'Dues',
        iconClass: 'bi bi-people',
        path: null,
        subMenus: [
            {id: 2, title: 'Due Collections', path: 'due-collections', roles: []},
            {id: 1, title: 'Due Payments', path: 'due-payments', roles: []},
        ],
        roles: []
    },
    {
        id: 2,
        title: 'Investors',
        iconClass: 'bi bi-people',
        path: null,
        subMenus: [
            {id: 3, title: 'Cash Transactions', path: 'investor-transaction/list', roles: []},
            {id: 2, title: 'All Investors', path: 'investor/list', roles: []},
            {id: 1, title: 'New Investors', path: 'investor/create', roles: []},
        ],
        roles: []
    },
    {
        id: 1,
        title: 'Bank Accounts',
        iconClass: 'bi bi-bank',
        path: null,
        subMenus: [
            {id: 2, title: 'All Bank Account', path: 'bank-accounts/list', roles: []},
            {id: 1, title: 'New Bank Account', path: 'bank-accounts/create', roles: []},
        ],
        roles: []
    },
]

export default AccountingSidebar;