import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight } from 'lucide-react';
import { authAPI } from '@/services/api';

type AssociationType = 'company' | 'hospital' | null;
type AuditCategory = 'financial' | 'medical' | null;
type SystemPlacement = 'central' | 'association' | null;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [associationType, setAssociationType] = useState<AssociationType>(null);
  const [auditCategory, setAuditCategory] = useState<AuditCategory>(null);
  const [systemPlacement, setSystemPlacement] = useState<SystemPlacement>(null);
  const [accountData, setAccountData] = useState({
    associationName: '',
    userName: '',
    email: '',
    password: '',
  });

  const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup({
        email: accountData.email,
        password: accountData.password,
        name: accountData.userName,
        associationName: accountData.associationName,
        associationType,
        auditCategory,
        systemPlacement,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('association', JSON.stringify(response.data.association));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isStep1Valid = associationType !== null;
  const isStep2Valid = auditCategory !== null;
  const isStep3Valid = systemPlacement !== null;
  const isStep4Valid =
    accountData.associationName &&
    accountData.userName &&
    accountData.email &&
    accountData.password &&
    accountData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 font-semibold mb-2">AUDIT-AT-A-CLICK / V1</div>
            <h1 className="text-2xl font-bold">AUDIT AT-A-CLICK</h1>
          </div>
          {step > 1 && (
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 underline">
              Already provisioned? Sign in →
            </a>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className={step >= 1 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            ASSOCIATION
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 2 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            AUDIT CATEGORY
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 3 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            SYSTEM PLACEMENT
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 4 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            ACCOUNT
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-8 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full overflow-y-auto">
        {step === 1 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 01 / 03</p>
              <h2 className="text-4xl font-bold mb-2">What is your association?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setAssociationType('company')}
                className={`border-2 rounded cursor-pointer transition-all ${
                  associationType === 'company' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-t"></div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      associationType === 'company' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {associationType === 'company' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <h3 className="text-lg font-bold">Company</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track financial records across employees, vendors, and departments.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAssociationType('hospital')}
                className={`border-2 rounded cursor-pointer transition-all ${
                  associationType === 'hospital' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-t"></div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      associationType === 'hospital' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {associationType === 'hospital' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <h3 className="text-lg font-bold">Hospital</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track patient encounters, diagnoses, treatments, and billing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 02 / 03</p>
              <h2 className="text-4xl font-bold mb-2">Audit which category?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setAuditCategory('financial')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  auditCategory === 'financial' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    auditCategory === 'financial' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {auditCategory === 'financial' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Financial Records</h3>
                    <p className="text-sm text-gray-600">
                      Transactions, expenses, payroll. Detects unusual patterns.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setAuditCategory('medical')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  auditCategory === 'medical' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    auditCategory === 'medical' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {auditCategory === 'medical' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Medical Records</h3>
                    <p className="text-sm text-gray-600">
                      Patient encounters, diagnoses, billing. Detects HIPAA gaps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 03 / 03</p>
              <h2 className="text-4xl font-bold mb-2">Where is this system installed?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setSystemPlacement('central')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  systemPlacement === 'central' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    systemPlacement === 'central' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {systemPlacement === 'central' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Central System</h3>
                    <p className="text-sm text-gray-600">
                      Aggregates anomalies and generates legal write-ups.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSystemPlacement('association')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  systemPlacement === 'association' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    systemPlacement === 'association' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {systemPlacement === 'association' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Association System</h3>
                    <p className="text-sm text-gray-600">
                      Local mode. Forwards anomalies upstream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">FINAL STEP</p>
              <h2 className="text-3xl font-bold mb-2">Provision your account</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 mb-6">
              <p className="text-xs text-gray-600 font-semibold mb-3">SELECTION SUMMARY</p>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-gray-500">ASSOCIATION</p>
                  <p className="font-semibold text-black capitalize">{associationType}</p>
                </div>
                <div>
                  <p className="text-gray-500">CATEGORY</p>
                  <p className="font-semibold text-black capitalize">{auditCategory}</p>
                </div>
                <div>
                  <p className="text-gray-500">SYSTEM</p>
                  <p className="font-semibold text-black capitalize">{systemPlacement}</p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 font-semibold mb-2">ASSOCIATION NAME</label>
                <input
                  type="text"
                  placeholder="St. Helena Memorial Hospital"
                  value={accountData.associationName}
                  onChange={(e) =>
                    setAccountData({ ...accountData, associationName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-semibold mb-2">YOUR NAME</label>
                  <input
                    type="text"
                    placeholder="Julie"
                    value={accountData.userName}
                    onChange={(e) => setAccountData({ ...accountData, userName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight } from 'lucide-react';
import { authAPI } from '@/services/api';

type AssociationType = 'company' | 'hospital' | null;
type AuditCategory = 'financial' | 'medical' | null;
type SystemPlacement = 'central' | 'association' | null;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [associationType, setAssociationType] = useState<AssociationType>(null);
  const [auditCategory, setAuditCategory] = useState<AuditCategory>(null);
  const [systemPlacement, setSystemPlacement] = useState<SystemPlacement>(null);
  const [accountData, setAccountData] = useState({
    associationName: '',
    userName: '',
    email: '',
    password: '',
  });

  const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup({
        email: accountData.email,
        password: accountData.password,
        name: accountData.userName,
        associationName: accountData.associationName,
        associationType,
        auditCategory,
        systemPlacement,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('association', JSON.stringify(response.data.association));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isStep1Valid = associationType !== null;
  const isStep2Valid = auditCategory !== null;
  const isStep3Valid = systemPlacement !== null;
  const isStep4Valid =
    accountData.associationName &&
    accountData.userName &&
    accountData.email &&
    accountData.password &&
    accountData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 font-semibold mb-2">AUDIT-AT-A-CLICK / V1</div>
            <h1 className="text-2xl font-bold">AUDIT AT-A-CLICK</h1>
          </div>
          {step > 1 && (
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 underline">
              Already provisioned? Sign in →
            </a>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className={step >= 1 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            ASSOCIATION
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 2 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            AUDIT CATEGORY
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 3 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            SYSTEM PLACEMENT
          </span>
          <span className="text-gray-400">—</span>
          <span className={step >= 4 ? 'text-black bg-black text-white px-2 py-1 rounded' : 'text-gray-400 border border-gray-300 px-2 py-1 rounded'}>
            ACCOUNT
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-8 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full overflow-y-auto">
        {step === 1 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 01 / 03</p>
              <h2 className="text-4xl font-bold mb-2">What is your association?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setAssociationType('company')}
                className={`border-2 rounded cursor-pointer transition-all ${
                  associationType === 'company' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-t"></div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      associationType === 'company' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {associationType === 'company' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <h3 className="text-lg font-bold">Company</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track financial records across employees, vendors, and departments.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAssociationType('hospital')}
                className={`border-2 rounded cursor-pointer transition-all ${
                  associationType === 'hospital' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-t"></div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      associationType === 'hospital' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {associationType === 'hospital' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <h3 className="text-lg font-bold">Hospital</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track patient encounters, diagnoses, treatments, and billing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 02 / 03</p>
              <h2 className="text-4xl font-bold mb-2">Audit which category?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setAuditCategory('financial')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  auditCategory === 'financial' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    auditCategory === 'financial' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {auditCategory === 'financial' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Financial Records</h3>
                    <p className="text-sm text-gray-600">
                      Transactions, expenses, payroll. Detects unusual patterns.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setAuditCategory('medical')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  auditCategory === 'medical' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    auditCategory === 'medical' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {auditCategory === 'medical' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Medical Records</h3>
                    <p className="text-sm text-gray-600">
                      Patient encounters, diagnoses, billing. Detects HIPAA gaps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">QUESTION 03 / 03</p>
              <h2 className="text-4xl font-bold mb-2">Where is this system installed?</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setSystemPlacement('central')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  systemPlacement === 'central' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    systemPlacement === 'central' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {systemPlacement === 'central' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Central System</h3>
                    <p className="text-sm text-gray-600">
                      Aggregates anomalies and generates legal write-ups.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSystemPlacement('association')}
                className={`border-2 rounded cursor-pointer p-6 transition-all ${
                  systemPlacement === 'association' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                    systemPlacement === 'association' ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {systemPlacement === 'association' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Association System</h3>
                    <p className="text-sm text-gray-600">
                      Local mode. Forwards anomalies upstream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-semibold mb-2">FINAL STEP</p>
              <h2 className="text-3xl font-bold mb-2">Provision your account</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 mb-6">
              <p className="text-xs text-gray-600 font-semibold mb-3">SELECTION SUMMARY</p>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-gray-500">ASSOCIATION</p>
                  <p className="font-semibold text-black capitalize">{associationType}</p>
                </div>
                <div>
                  <p className="text-gray-500">CATEGORY</p>
                  <p className="font-semibold text-black capitalize">{auditCategory}</p>
                </div>
                <div>
                  <p className="text-gray-500">SYSTEM</p>
                  <p className="font-semibold text-black capitalize">{systemPlacement}</p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 font-semibold mb-2">ASSOCIATION NAME</label>
                <input
                  type="text"
                  placeholder="St. Helena Memorial Hospital"
                  value={accountData.associationName}
                  onChange={(e) =>
                    setAccountData({ ...accountData, associationName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-semibold mb-2">YOUR NAME</label>
                  <input
                    type="text"
                    placeholder="Julie"
                    value={accountData.userName}
                    onChange={(e) => setAccountData({ ...accountData, userName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-semibold mb-2">EMAIL</label>
                  <input
                    type="email"
                    placeholder="julie@example.com"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 font-semibold mb-2">PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={accountData.password}
                  onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center">
        <button
          onClick={handleBack}
          className={`px-6 py-2 rounded text-sm font-medium border border-gray-300 ${
            step === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-black hover:bg-gray-50'
          }`}
          disabled={step === 1}
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={
            loading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid) ||
            (step === 3 && !isStep3Valid) ||
            (step === 4 && !isStep4Valid)
          }
          className={`px-6 py-2 rounded text-sm font-medium flex items-center gap-2 ${
            loading ||
            (step === 1 && !isStep1Valid) ||
            (step === 2 && !isStep2Valid) ||
            (step === 3 && !isStep3Valid) ||
            (step === 4 && !isStep4Valid)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {loading ? 'Processing...' : step === 4 ? 'Provision workspace' : 'Continue'}
          {!loading && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
