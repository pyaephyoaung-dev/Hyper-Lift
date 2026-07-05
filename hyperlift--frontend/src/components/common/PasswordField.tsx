import { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { getPasswordStrength } from '../../utils/Helpers';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  showStrengthMeter?: boolean;
  autoComplete?: string;
}

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  minLength,
  showStrengthMeter = false,
  autoComplete = 'new-password',
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const strength = showStrengthMeter ? getPasswordStrength(value) : null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700/60 text-white rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-600"
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {showStrengthMeter && value && strength && (
        <div className="mt-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < strength.score ? strength.color : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p
            className={`mt-1.5 text-xs font-medium ${
              strength.level === 'weak'
                ? 'text-red-400'
                : strength.level === 'medium'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}
          >
            {strength.label} password
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
