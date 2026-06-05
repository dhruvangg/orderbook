import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DrawerMenu } from '@/components/DrawerMenu';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e4e4e7',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          padding: '0 16px',
          maxWidth: '512px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '-6px',
              }}
            >
              <ArrowLeft className="h-5 w-5 text-zinc-700" />
            </button>
          )}
          {isHome && (
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#dcfce7',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              📋
            </div>
          )}
          <h1
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#18181b',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h1>
        </div>
        <DrawerMenu />
      </div>
    </header>
  );
}
