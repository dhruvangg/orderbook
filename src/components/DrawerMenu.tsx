import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Info, Shield, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { saveLanguage, clearItems } from '@/lib/storage';
import { toast } from '@/components/ui/toast';

export function DrawerMenu() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [visible, setVisible] = useState(false);

  const isCustomerPage = location.pathname === '/';

  // Animate in after mount
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 250);
  };

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    saveLanguage(lang);
  };

  const handleClear = () => {
    clearItems();
    setConfirmClear(false);
    handleClose();
    toast(t('menu.cleared'));
    if (isCustomerPage) {
      window.location.reload();
    }
  };

  return (
    <>
      <button
        id="menu-toggle"
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-zinc-700" />
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: visible ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
              backdropFilter: visible ? 'blur(4px)' : 'none',
              transition: 'background-color 0.25s ease, backdrop-filter 0.25s ease',
            }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '280px',
              maxWidth: '85vw',
              backgroundColor: '#ffffff',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.12)',
              transform: visible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #f4f4f5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  📋
                </div>
                <span style={{ fontWeight: 600, fontSize: '16px', color: '#18181b' }}>
                  {t('app.name')}
                </span>
              </div>
              <button
                onClick={handleClose}
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            {/* Drawer Content */}
            <nav style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
              {/* Language Section */}
              <div
                style={{
                  padding: '12px 16px',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#a1a1aa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  <Globe style={{ width: '14px', height: '14px' }} />
                  {t('menu.language')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => switchLanguage('en')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: i18n.language === 'en' ? '2px solid #16a34a' : '1px solid #e4e4e7',
                      backgroundColor: i18n.language === 'en' ? '#f0fdf4' : '#ffffff',
                      color: i18n.language === 'en' ? '#15803d' : '#52525b',
                      fontWeight: i18n.language === 'en' ? 600 : 400,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage('gu')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: i18n.language === 'gu' ? '2px solid #16a34a' : '1px solid #e4e4e7',
                      backgroundColor: i18n.language === 'gu' ? '#f0fdf4' : '#ffffff',
                      color: i18n.language === 'gu' ? '#15803d' : '#52525b',
                      fontWeight: i18n.language === 'gu' ? 600 : 400,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ગુજરાતી
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#f4f4f5', margin: '4px 16px' }} />

              {/* Menu Items */}
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    handleClose();
                    setTimeout(() => navigate('/about'), 280);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#3f3f46',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f4f4f5')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <Info style={{ width: '18px', height: '18px', color: '#a1a1aa' }} />
                  <span style={{ flex: 1 }}>{t('menu.about')}</span>
                  <ChevronRight style={{ width: '16px', height: '16px', color: '#d4d4d8' }} />
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setTimeout(
                      () => navigate('/about', { state: { scrollToPrivacy: true } }),
                      280
                    );
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#3f3f46',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f4f4f5')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <Shield style={{ width: '18px', height: '18px', color: '#a1a1aa' }} />
                  <span style={{ flex: 1 }}>{t('menu.privacy')}</span>
                  <ChevronRight style={{ width: '16px', height: '16px', color: '#d4d4d8' }} />
                </button>
              </div>

              {/* Clear List */}
              {isCustomerPage && (
                <>
                  <div
                    style={{ height: '1px', backgroundColor: '#f4f4f5', margin: '4px 16px' }}
                  />
                  <div style={{ padding: '4px 0' }}>
                    <button
                      onClick={() => setConfirmClear(true)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '14px',
                        color: '#dc2626',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#fef2f2')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Trash2 style={{ width: '18px', height: '18px' }} />
                      <span style={{ flex: 1 }}>{t('menu.clearList')}</span>
                    </button>
                  </div>
                </>
              )}
            </nav>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #f4f4f5',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '11px', color: '#a1a1aa' }}>
                {t('about.version')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear Dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('menu.clearList')}</DialogTitle>
            <DialogDescription>{t('menu.clearConfirm')}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setConfirmClear(false)}>
              {t('menu.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              {t('menu.yes')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
