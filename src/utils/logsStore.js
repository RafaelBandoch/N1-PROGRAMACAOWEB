const logs = [];

module.exports = {
  addLog: (log) => {
    logs.unshift(log);
    if (logs.length > 500) {
      logs.pop();
    }
  },
  getLogs: () => logs
};
