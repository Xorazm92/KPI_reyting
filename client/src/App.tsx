import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { AddCompany } from './pages/AddCompany';
import { CompanyDetails } from './pages/CompanyDetails';
import { Risks } from './pages/Risks';
import { Comparison } from './pages/Comparison';
import { Statistics } from './pages/Statistics';
import './App.css';

function AppContent() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <CompanyProvider>
      <div className="app-container">
        <Header />
        <Navigation />
        <main className="main-content">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/company/:id" component={CompanyDetails} />
            <Route path="/risks" component={Risks} />
            <Route path="/add-company" component={AddCompany} />
            <Route path="/edit/:id" component={AddCompany} />
            <Route path="/comparison" component={Comparison} />
            <Route path="/statistics" component={Statistics} />
            <Route>
              <div className="not-found">
                <h2>404 - Sahifa topilmadi</h2>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </CompanyProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
