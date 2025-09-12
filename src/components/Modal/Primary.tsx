import React, { useLayoutEffect, useEffect, useState } from "react";
import { Modal, Button, ConfigProvider } from "antd";

interface PrimaryModalProps {
  confirmClose: boolean;
  open: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  setIsOpen: Function;
  onClosed: Function;
  [key: string]: any;
}

const PrimaryModal: React.FC<PrimaryModalProps> = ({
  confirmClose,
  footer,
  open,
  title,
  children,
  onClosed,
  setIsOpen,
  ...props
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const [showConfirmClose, setShowConfirmClose] = useState<boolean>(false);
  const [modalClosed, setModalClosed] = useState<boolean>(false);

  const getCssVariable = (variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setBackgroundColor(getCssVariable("--background-color"));
      setTextColor(getCssVariable("--text-color"));
      setPrimaryColor(getCssVariable("--primary-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (confirmClose && !modalClosed && open) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [confirmClose, modalClosed, open]);

  const toggleConfirmClose = () => {
    setShowConfirmClose((prev) => !prev);
  };

  const handleCancel = () => {
    if (confirmClose) {
      setShowConfirmClose(true);
    } else {
      setModalClosed(true);
      setIsOpen(false);
    }
  };

  const handleConfirmClose = () => {
    setModalClosed(true);
    setIsOpen(false);
    onClosed();
    setShowConfirmClose(false);
  };

  const handleConfirmCancel = () => {
    setShowConfirmClose(false);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryColor,
            colorBgElevated: backgroundColor,
            colorTextBase: textColor,
            colorBorder: textColor,
          },
          components: {
            Modal: {
              titleFontSize: 20,
            },
          },
        }}
      >
        <Modal
          onCancel={toggleConfirmClose}
          title={title}
          open={open}
          destroyOnClose={true}
          footer={
            footer == undefined || footer == null ? (
              <>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgBase: backgroundColor,
                      colorPrimary: textColor,
                    },
                  }}
                >
                  <Button aria-label="Cancel" onClick={handleCancel}>
                    <span>Cancel</span>
                  </Button>
                </ConfigProvider>
                <Button aria-label="Ok" type="primary">
                  <span>OK</span>
                </Button>
              </>
            ) : (
              footer
            )
          }
          {...props}
        >
          {children}
        </Modal>

        <Modal
          onCancel={handleConfirmCancel}
          width={500}
          footer={
            <>
              <div className="flex flex-row justify-end items-end space-x-3">
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgBase: backgroundColor,
                      colorPrimary: textColor,
                    },
                  }}
                >
                  <Button
                    aria-label="No"
                    className="rounded-full"
                    onClick={handleConfirmCancel}
                  >
                    <span>No</span>
                  </Button>
                </ConfigProvider>
                <Button
                  aria-label="Yes"
                  type="primary"
                  className="rounded-full"
                  onClick={handleConfirmClose}
                  danger
                >
                  <span>Yes</span>
                </Button>
              </div>
            </>
          }
          title="Close Tab"
          centered
          destroyOnClose={true}
          open={showConfirmClose}
        >
          <span className="mt-3">
            Are you sure you wish to close this tab? Any unsaved progress will
            be lost.
          </span>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default PrimaryModal;
