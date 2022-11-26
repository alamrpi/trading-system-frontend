import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";

const Dashboard = lazy(() => import('../Containers/Accounting/Dashboard/Index'));

const BankAccounts = lazy(() => import('../Containers/Accounting/Banks/Index'));
const BankAccountsCreateOrEdit = lazy(() => import('../Containers/Accounting/Banks/CreateOrUpdate'));

const DuePaymentsCreateOrUpdate = lazy(() => import('../Containers/Accounting/DuePayments/CreateOrUpdate'));
const DuePayments = lazy(() => import('../Containers/Accounting/DuePayments/Index'));

const DueCollectionsCreateOrUpdate = lazy(() => import('../Containers/Accounting/DueCollections/CreateOrUpdate'));
const DueCollections = lazy(() => import('../Containers/Accounting/DueCollections/Index'));

const InvestorCreateOrEdit = lazy(() => import('../Containers/Accounting/Investors/CreateOrUpdate'));
const Investors = lazy(() => import('../Containers/Accounting/Investors/Index'));

const InvestorTransactionCreateOrEdit = lazy(() => import('../Containers/Accounting/Investors/Transactions/CreateOrUpdate'));
const InvestorTransaction = lazy(() => import('../Containers/Accounting/Investors/Transactions/Index'));

const HeadCreateOrEdit = lazy(() => import('../Containers/Accounting/Heads/CreateOrUpdate'));
const Heads = lazy(() => import('../Containers/Accounting/Heads/Index'));

const RevenueExpenseCreateOrEdit = lazy(() => import('../Containers/Accounting/RevenueExpense/CreateOrUpdate'));
const RevenueExpense = lazy(() => import('../Containers/Accounting/RevenueExpense/Index'));

const BankAccountLedger = lazy(() => import('../Containers/Accounting/Ledgers/BankAccounts'));
const InvestorsLedger = lazy(() => import('../Containers/Accounting/Ledgers/Investors'));
const CustomerLedger = lazy(() => import('../Containers/Accounting/Ledgers/Customer'));
const SupplierLedger = lazy(() => import('../Containers/Accounting/Ledgers/Supplier'));

const CashFlows = lazy(() => import('../Containers/Accounting/Statements/CashFlows'));
const OwnerEquity = lazy(() => import('../Containers/Accounting/Statements/OwnerEquity'));
const BalanceSheet = lazy(() => import('../Containers/Accounting/Statements/BalanceSheet'));

const AccountingRoutes = () => {
    return (
        <Routes>
                <Route path='statements/balance-sheet' element={<BalanceSheet />}></Route>
                <Route path='statements/owner-equity' element={<OwnerEquity />}></Route>
                <Route path='statements/cash-flows' element={<CashFlows />}></Route>

                <Route path='ledgers/supplier' element={<SupplierLedger />}></Route>
                <Route path='ledgers/customer' element={<CustomerLedger />}></Route>
                <Route path='ledgers/investor' element={<InvestorsLedger />}></Route>
                <Route path='ledgers/bank-account' element={<BankAccountLedger />}></Route>

            <Route path='revenue-expense/update/:id' element={<RevenueExpenseCreateOrEdit />}></Route>
            <Route path='revenue-expense/create' element={<RevenueExpenseCreateOrEdit />}></Route>
            <Route path='revenue-expense' element={<RevenueExpense />}></Route>

            <Route path='heads/update/:id' element={<HeadCreateOrEdit />}></Route>
            <Route path='heads/create' element={<HeadCreateOrEdit />}></Route>
            <Route path='heads' element={<Heads />}></Route>

            <Route path='investor-transaction/update/:id' element={<InvestorTransactionCreateOrEdit />}></Route>
            <Route path='investor-transaction/create' element={<InvestorTransactionCreateOrEdit />}></Route>
            <Route path='investor-transaction/list' element={<InvestorTransaction />}></Route>

            <Route path='investor/update/:id' element={<InvestorCreateOrEdit />}></Route>
            <Route path='investor/create' element={<InvestorCreateOrEdit />}></Route>
            <Route path='investor/list' element={<Investors />}></Route>

            <Route path='due-collections/update/:id' element={<DueCollectionsCreateOrUpdate />}></Route>
            <Route path='due-collections/create' element={<DueCollectionsCreateOrUpdate />}></Route>
            <Route path='due-collections' element={<DueCollections />}></Route>

            <Route path='due-payments/update/:id' element={<DuePaymentsCreateOrUpdate />}></Route>
            <Route path='due-payments/create' element={<DuePaymentsCreateOrUpdate />}></Route>
            <Route path='due-payments' element={<DuePayments />}></Route>

            <Route path='bank-accounts/update/:id' element={<BankAccountsCreateOrEdit />}></Route>
            <Route path='bank-accounts/create' element={<BankAccountsCreateOrEdit />}></Route>
            <Route path='bank-accounts/list' element={<BankAccounts />}></Route>

            <Route index element={<Dashboard/>}></Route>
        </Routes>
    );
};

export default AccountingRoutes;