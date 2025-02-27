const queueData = [
  { id: 1, name: "John Doe", phone: "08123456789", service: "Siap Print", serviceId: "J0001", locket: "loket 01", startAt: "10:30 AM", completedAt: "10:30 AM", queueNumber: "001", status: "Menunggu", called: false, active: true},
  { id: 2, name: "Jane Smith", phone: "08234567890", service: "Design", serviceId: "J0002", locket: "loket 04", startAt: "11:15 AM", completedAt: "11:15 AM", queueNumber: "002", status: "Menunggu", called: false, active: true},
  { id: 3, name: "Michael Johnson", phone: "08345678901", service: "FotoCopy", serviceId: "J0003", locket: "loket 08", startAt: "11:50 AM", completedAt: "11:50 AM", queueNumber: "003", status: "Menunggu", called: false, active: true},
  { id: 4, name: "Emily Brown", phone: "08456789012", service: "Tamu", serviceId: "J0006", locket: "loket 02", startAt: "12:10 PM", completedAt: "12:10 PM", queueNumber: "004", status: "Menunggu", called: false, active: true},
  { id: 5, name: "David Wilson", phone: "08567890123", service: "Online", serviceId: "J0005", locket: "loket 05", startAt: "04:00 PM", completedAt: "12:50 PM", queueNumber: "005", status: "Menunggu", called: false, active: true},
  { id: 6, name: "Sophia Martinez", phone: "08678901234", service: "Online", serviceId: "J0005", locket: "loket 06", startAt: "01:30 PM", completedAt: "01:30 PM", queueNumber: "006", status: "Menunggu", called: false, active: true},
  { id: 7, name: "James Anderson", phone: "08789012345", service: "Siap Print", serviceId: "J0001", locket: "loket 03", startAt: "02:15 PM", completedAt: "02:15 PM", queueNumber: "007", status: "Menunggu", called: false, active: true},
  { id: 8, name: "Olivia Thomas", phone: "08890123456", service: "Design", serviceId: "J0002", locket: "loket 07", startAt: "02:50 PM", completedAt: "02:50 PM", queueNumber: "008", status: "Menunggu", called: false, active: true},
  { id: 9, name: "Liam White", phone: "08901234567", service: "FotoCopy", serviceId: "J0003", locket: "loket 09", startAt: "03:20 PM", completedAt: "03:20 PM", queueNumber: "009", status: "Menunggu", called: false, active: true},
  { id: 10, name: "Emma Harris", phone: "08012345678", service: "Siap Print", serviceId: "J0001", locket: "loket 10", startAt: "03:50 PM", completedAt: "03:50 PM", queueNumber: "010", status: "Menunggu", called: false, active: true},
  { id: 11, name: "John Doe", phone: "08123456789", service: "Siap Print", serviceId: "J0001", locket: "loket 01", startAt: "10:30 AM", completedAt: "10:30 AM", queueNumber: "001", status: "Menunggu", called: false, active: true},
  { id: 12, name: "Jane Smith", phone: "08234567890", service: "Design", serviceId: "J0002", locket: "loket 04", startAt: "11:15 AM", completedAt: "11:15 AM", queueNumber: "002", status: "Menunggu", called: false, active: true},
  { id: 13, name: "Michael Johnson", phone: "08345678901", service: "FotoCopy", serviceId: "J0003", locket: "loket 08", startAt: "11:50 AM", completedAt: "11:50 AM", queueNumber: "003", status: "Menunggu", called: false, active: true},
  { id: 14, name: "Emily Brown", phone: "08456789012", service: "Online", serviceId: "J0005", locket: "loket 02", startAt: "12:10 PM", completedAt: "12:10 PM", queueNumber: "004", status: "Menunggu", called: false, active: true},
  { id: 15, name: "David Wilson", phone: "08567890123", service: "Design", serviceId: "J0002", locket: "loket 05", startAt: "04:00 PM", completedAt: "12:50 PM", queueNumber: "005", status: "Menunggu", called: false, active: true},
  { id: 16, name: "John Doe", phone: "08123456789", service: "Online", serviceId: "J0005", locket: "loket 01", startAt: "10:30 AM", completedAt: "10:30 AM", queueNumber: "001", status: "Menunggu", called: false, active: true},
  { id: 17, name: "Jane Smith", phone: "08234567890", service: "Design", serviceId: "J0002", locket: "loket 04", startAt: "11:15 AM", completedAt: "11:15 AM", queueNumber: "002", status: "Menunggu", called: false, active: true},
  { id: 18, name: "Michael Johnson", phone: "08345678901", service: "Retur", serviceId: "J0004", locket: "loket 08", startAt: "11:50 AM", completedAt: "11:50 AM", queueNumber: "003", status: "Menunggu", called: false, active: true},
  { id: 19, name: "Emily Brown", phone: "08456789012", service: "Online", serviceId: "J0005", locket: "loket 02", startAt: "12:10 PM", completedAt: "12:10 PM", queueNumber: "004", status: "Menunggu", called: false, active: true},
  { id: 20, name: "David Wilson", phone: "08567890123", service: "Design", serviceId: "J0002", locket: "loket 05", startAt: "04:00 PM", completedAt: "12:50 PM", queueNumber: "005", status: "Menunggu", called: false, active: true},
  { id: 21, name: "Sophia Martinez", phone: "08678901234", service: "Retur", serviceId: "J0004", locket: "loket 06", startAt: "01:30 PM", completedAt: "01:30 PM", queueNumber: "006", status: "Menunggu", called: false, active: true},
  { id: 22, name: "James Anderson", phone: "08789012345", service: "Online", serviceId: "J0005", locket: "loket 03", startAt: "02:15 PM", completedAt: "02:15 PM", queueNumber: "007", status: "Menunggu", called: false, active: true},
  { id: 23, name: "Olivia Thomas", phone: "08890123456", service: "Design", serviceId: "J0002", locket: "loket 07", startAt: "02:50 PM", completedAt: "02:50 PM", queueNumber: "008", status: "Menunggu", called: false, active: true},
  { id: 24, name: "Liam White", phone: "08901234567", service: "Tamu", serviceId: "J0006", locket: "loket 09", startAt: "03:20 PM", completedAt: "03:20 PM", queueNumber: "009", status: "Menunggu", called: false, active: true},
  { id: 25, name: "Emma Harris", phone: "08012345678", service: "Siap Print", serviceId: "J0001", locket: "loket 10", startAt: "03:50 PM", completedAt: "03:50 PM", queueNumber: "010", status: "Menunggu", called: false, active: true},
];

export const getQueueSettingsData = () => {
  return queueData.slice(0, 6).map(({ service, serviceId, active, id }) => ({
    id,
    service,
    serviceId,
    active,
  }));
};

export const handleCall = (id) => {
  const index = queueData.findIndex((item) => item.id === id);
  if (index !== -1) {
    queueData[index].called = true;
  }
};

export const handleEdit = (id) => {
  console.log("Edit data dengan ID:", id);
};

export const handleDelete = (id) => {
  const index = queueData.findIndex((item) => item.id === id);
  if (index !== -1) {
    queueData.splice(index, 1);
  }
};

export const toggleServiceStatus = (id) => {
  const index = queueData.findIndex((item) => item.id === id);
  if (index !== -1) {
    queueData[index].active = !queueData[index].active;
  }
};

export const getFilteredQueueData = (callQueueView = false) => {
  let filteredQueue = queueData.filter((item) =>
    callQueueView ? item.status === "Menunggu" : true
  );

  // Urutkan berdasarkan status "Menunggu" terlebih dahulu, lalu berdasarkan startAt
  filteredQueue.sort((a, b) => {
    if (a.status === "Menunggu" && b.status !== "Menunggu") return -1;
    if (b.status === "Menunggu" && a.status !== "Menunggu") return 1;

    const timeA = new Date(`1970/01/01 ${a.startAt}`);
    const timeB = new Date(`1970/01/01 ${b.startAt}`);
    return timeA - timeB;
  });

  return filteredQueue;
};

export const getQueueDisplayData = () => {
  const queueData = getFilteredQueueData(false) || [];

  // Ambil maksimal 25 data untuk animasi berjalan
  const displayedQueue = queueData.slice(0, 25);

  return displayedQueue.map(({ queueNumber, locket }) => ({
    number: queueNumber,
    counter: locket || "-",
  }));
};

import { useState } from "react";

export const useQueueData = (settingsView, callQueueView) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Mengambil data berdasarkan kondisi tampilan
  const queueData = settingsView ? getQueueSettingsData() || [] : getFilteredQueueData(callQueueView) || [];

  // Filter berdasarkan pencarian
  const filteredData = searchQuery
    ? queueData.filter((item) =>
        (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.service?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : queueData;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return {
    currentItems,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    indexOfFirstItem,
  };
};

