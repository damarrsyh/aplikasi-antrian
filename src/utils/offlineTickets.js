// src/utils/offlineTickets.js

export const saveOfflineTicket = (ticketData) => {
  let offlineTickets = JSON.parse(localStorage.getItem("offlineTickets")) || [];
  offlineTickets.push(ticketData);
  localStorage.setItem("offlineTickets", JSON.stringify(offlineTickets));
};

export const getOfflineTickets = () => {
  return JSON.parse(localStorage.getItem("offlineTickets")) || [];
};

export const removeOfflineTicket = (ticketData) => {
  let offlineTickets = JSON.parse(localStorage.getItem("offlineTickets")) || [];
  offlineTickets = offlineTickets.filter(ticket => ticket.nomor !== ticketData.nomor);
  localStorage.setItem("offlineTickets", JSON.stringify(offlineTickets));
};
