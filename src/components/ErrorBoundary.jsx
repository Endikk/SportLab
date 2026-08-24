import { Component } from "react";

// Filet de sécurité : sans ça, la moindre exception de rendu laisse une page blanche
// irrécupérable (l'app n'a pas de fallback serveur, tout est client-side).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleReset = () => {
    // Une séance en cours corrompue re-crashe à chaque ouverture tant qu'elle est
    // en localStorage : on offre une porte de sortie sans vider tout le navigateur.
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("sportlab_workout_progress")) localStorage.removeItem(key);
      }
    } catch {
      /* stockage indisponible — on recharge quand même */
    }
    window.location.hash = "#/";
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="page error-page">
        <div className="error-box">
          <span className="error-emoji" aria-hidden="true">😵</span>
          <h1 className="error-title">Aïe, un pépin</h1>
          <p className="error-text">
            L&apos;application a rencontré une erreur inattendue. Tes séances du programme
            ne sont pas affectées.
          </p>
          <button className="error-btn" onClick={this.handleReset}>
            Réinitialiser et revenir à l&apos;accueil
          </button>
          <p className="error-detail">{String(this.state.error?.message || this.state.error)}</p>
        </div>
      </div>
    );
  }
}
