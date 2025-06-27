import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>CineStream</h3>
            <p>Tu plataforma de streaming favorita con las mejores películas.</p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Navegación</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Películas</a></li>
              <li><a href="#">Series</a></li>
              <li><a href="#">Mi Lista</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Géneros</h4>
            <ul>
              <li><a href="#">Acción</a></li>
              <li><a href="#">Ciencia Ficción</a></li>
              <li><a href="#">Drama</a></li>
              <li><a href="#">Comedia</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Ayuda</h4>
            <ul>
              <li><a href="#">Soporte</a></li>
              <li><a href="#">Términos de Uso</a></li>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 CineStream. Todos los derechos reservados.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">📺</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
