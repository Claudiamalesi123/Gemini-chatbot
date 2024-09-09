import '../styles/globals.css';
import '../styles/Home.module.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <header>
        <h1>NewsletterBot</h1>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;