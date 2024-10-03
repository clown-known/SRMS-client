const getChipColor = (action?: string) => {
    switch (action?.toLowerCase()) {
      case 'read':
        return 'primary';
      case 'create':
        return 'success';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      default:
        return 'default';
    }
  };
export default getChipColor