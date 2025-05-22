export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return 'Données de commande invalides. Veuillez vérifier vos informations.';
      case 401:
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return 'Accès non autorisé.';
      case 404:
        return 'Service de commande non disponible.';
      case 409:
        return 'Conflit avec une commande existante.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  } else {
    // Something else went wrong
    return 'Une erreur s\'est produite lors de la préparation de la requête.';
  }
};