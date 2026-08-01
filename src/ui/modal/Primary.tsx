import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, ConfigProvider } from "antd";
import { ThemeContext } from "@/context/ThemeContext";

import { useTranslation } from "react-i18next";

interface PrimaryModalProps {
  confirmClose: boolean;
  noConfirmationDialog: boolean;
  open?: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  setIsOpen: Function;
  onClosed: Function;
  showCloseBtn?: boolean;
  [key: string]: any;
}

const PrimaryModal: React.FC<PrimaryModalProps> = ({
  confirmClose,
  noConfirmationDialog,
  footer,
  open,
  title,
  children,
  onClosed,
  setIsOpen,
  showCloseBtn = true,
  ...props
}) => {
  const { colorProperties } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [showConfirmClose, setShowConfirmClose] = useState<boolean>(false);
  const [modalClosed, setModalClosed] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    console.log("open");

    setTimeout(() => {
      const buttons = document.getElementsByTagName(
        "button",
      ) as HTMLCollectionOf<HTMLElement>;
      for (let button of buttons) {
        if (button.getAttribute("aria-label") === "Close") {
          console.log(showCloseBtn);
          if (!showCloseBtn) {
            button.style.display = "none";
          } else {
            button.style.display = "block";
          }
        }
      }
    }, 100);
  }, [open]);

  const handleBeforeUnload = (e) => {
    if (confirmClose && !modalClosed && open) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  useEffect(() => {
    if (noConfirmationDialog) {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [noConfirmationDialog]);

  useEffect(() => {
    if (!noConfirmationDialog) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [confirmClose, modalClosed, open]);

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
            colorPrimary: colorProperties.primaryColor
              ? colorProperties.primaryColor
              : "#1677ff",
            colorBgElevated: colorProperties.backgroundColor
              ? colorProperties.backgroundColor
              : "#1677ff",
            colorTextBase: colorProperties.textColor
              ? colorProperties.textColor
              : "#1677ff",
            colorBorder: colorProperties.textColor
              ? colorProperties.textColor
              : "#1677ff",
          },
          components: {
            Modal: {
              titleFontSize: 20,
            },
          },
        }}
      >
        <Modal
          onCancel={handleCancel}
          title={title}
          open={open}
          destroyOnClose={true}
          footer={
            footer == undefined || footer == null ? (
              <>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgBase: colorProperties.backgroundColor
                        ? colorProperties.backgroundColor
                        : "#1677ff",
                      colorPrimary: colorProperties.textColor
                        ? colorProperties.textColor
                        : "#1677ff",
                    },
                  }}
                >
                  <Button aria-label="Cancel" onClick={handleCancel}>
                    <span>{t("general.Cancel")}</span>
                  </Button>
                </ConfigProvider>
                <Button aria-label="Ok" type="primary">
                  <span>{t("general.OK")}</span>
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
                      colorBgBase: colorProperties.backgroundColor
                        ? colorProperties.backgroundColor
                        : "#1677ff",
                      colorPrimary: colorProperties.textColor
                        ? colorProperties.textColor
                        : "#1677ff",
                    },
                  }}
                >
                  <Button
                    aria-label={t("general.No")}
                    className="rounded-full !bg-transparent"
                    onClick={handleConfirmCancel}
                  >
                    <span>{t("general.No")}</span>
                  </Button>
                </ConfigProvider>
                <Button
                  aria-label={t("general.Yes")}
                  type="primary"
                  className="rounded-full"
                  onClick={handleConfirmClose}
                  danger
                >
                  <span>{t("general.Yes")}</span>
                </Button>
              </div>
            </>
          }
          title={t("PrimaryModal.closeTabTitle")}
          centered
          destroyOnClose={true}
          open={showConfirmClose}
        >
          <span className="mt-3">{t("PrimaryModal.closeTabQuestion")}</span>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default PrimaryModal;
