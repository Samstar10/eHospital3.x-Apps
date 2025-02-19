import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  Button,
  Tabs,
  TabList,
  Tab
} from "@carbon/react";
import styles from "./messages-dashboard.scss";
import CustomDataTable, {
  TableHeaderItem,
  TableRowItem,
} from "../components/messages-table.component";
import MessagesHeader from "../messages-header/messages-header.component";
import { useMessages, sendPatientMessage, resendAllMessages } from "../hooks/useMessages";
import EmptyState from "../components/empty-state/empty-state.component";

const MessagesDashboard: React.FC = () => {
  const { t } = useTranslation();
  const messages = useMessages();

  const headers: TableHeaderItem[] = [
    { key: "date", header: "Date" },
    { key: "name", header: "Name" },
    { key: "phoneNo", header: "Phone No." },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action" },
    { key: "fullMessage", header: "Full Message" },
    { key: "sentTimestamp", header: "Sent Time" },
    { key: "patientUuid", header: "Patient Uuid" },
  ];

  const rows: TableRowItem[] = messages.map((msg) => {
    return {
      id: msg.id,
      patientUuid: msg.patientUuid,
      name: msg.name,
      date: msg.date,
      phoneNo: msg.phoneNo,
      message: msg.message,
      fullMessage: msg.fullMessage,
      status: msg.status,
      sentTimestamp: msg.sentTimestamp,
    };
  })

  const periodFilterItems = [
    { text: "Today" },
    { text: "Last one week" },
    { text: "Last one month" },
  ];

	const statusFilterItems = [
		{ text: "All" },
		{ text: "Sent" },
		{ text: "Failed" },
    { text: "Scheduled" },
	]

  const onResend = async(patientUuid) => {
    try {
      await sendPatientMessage(patientUuid);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onResendAll = async() => {
    try {
      await resendAllMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <>
			<MessagesHeader title={t('home', 'Home')} />

      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div>
            <Tabs>
              <TabList contained>
                <Tab>Appointment Reminders</Tab>
                <Tab>LLM Messages</Tab>
              </TabList>
            </Tabs>
          </div>

          <div>
            <Dropdown
              titleText="Filter by period: "
              initialSelectedItem={periodFilterItems[0]}
              items={periodFilterItems}
              itemToString={(item) => (item ? item.text : "")}
              type="inline"
              className={styles.filter}
            />

            <Dropdown
              titleText="Filter by status: "
              initialSelectedItem={statusFilterItems[0]}
              items={statusFilterItems}
              itemToString={(item) => (item ? item.text : "")}
              type="inline"
              className={styles.filter}
              autoAlign={true}
            />
          </div>

          {rows.length > 0 && (
            <Button
              onClick={onResendAll}
            >
              Resend All Texts
            </Button>
          )}
        </div>

        {rows.length === 0 && (
          <div>
            <EmptyState />
          </div>
        )}

        {rows.length > 0 && <CustomDataTable headers={headers} rows={rows} onResend={onResend} />}
      </div>
    </>
  );
};

export default MessagesDashboard;
