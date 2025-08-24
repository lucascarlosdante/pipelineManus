import { getEnvironmentConfig } from '../config/environment';

export function EnvironmentHeader() {
  const envConfig = getEnvironmentConfig();

  return (
    <div 
      className="w-full py-2 px-4 text-center font-semibold text-sm"
      style={{
        backgroundColor: envConfig.bgColor,
        color: envConfig.textColor,
        borderBottom: `2px solid ${envConfig.color}`
      }}
    >
      🚀 Ambiente: {envConfig.name} ({envConfig.current.toUpperCase()})
    </div>
  );
}

