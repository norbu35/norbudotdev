import Terminal from "@/components/terminal/Terminal";
import TopologyCanvas from "@/components/topology/TopologyCanvas";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <>
      <div className="axiom-wallpaper" aria-hidden="true">
        <TopologyCanvas />
        <div className="city-vignette"></div>
        <div className="city-pixelate"></div>
      </div>

      <main className={styles.main}>
        <section className={styles.heroTerminal}>
          <Terminal />
        </section>

        <section className={styles.codexLore}>
          <h2><span className={styles.promptAngle}>{">"}</span> DEFERRED COMPILATION</h2>
          <div className={styles.loreBlock}>
            <p className={styles.loreLine}>The system is in partial collapse.</p>
            <p className={styles.loreLine}>
              It exists in deferred compilation — undefined topology, orphaned nodes, contradictory routes.
              You do not explore this space. You compile it into existence.
            </p>
            <p className={styles.loreLine}>
              Every command mutates topology. Every resolved constraint brings the geometry closer to stability.
              But be warned: the architecture does not tolerate perfection.
            </p>
          </div>
        </section>

        <section className={styles.codexLore}>
          <h2><span className={styles.promptAngle}>{">"}</span> STRUCTURAL NOISE</h2>
          <div className={styles.loreBlock}>
            <p className={styles.loreLine}>Look behind the terminal.</p>
            <p className={styles.loreLine}>
              That flickering void is not empty space; it is structural noise. It is probability awaiting an observer.
              When you issue instructions, the noise will collapse into defined geometry. Nodes will glow. Edges will snap into place.
            </p>
            <p className={styles.loreLine}>
              The more you interact, the lower the entropy falls.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
