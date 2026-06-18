function BackgroundOrbs() {
    const styles = {
        bgBlobs: {
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
        },
        blobBase: {
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(8px)',
        },
        b1: {
            width: 340, height: 340, top: -120, left: -100,
            background: 'radial-gradient(circle, #FFCB5E66, transparent 64%)',
        },
        b2: {
            width: 360, height: 360, top: -80, right: -130,
            background: 'radial-gradient(circle, #FFB05444, transparent 64%)',
        },
        b3: {
            width: 340, height: 340, top: 600, left: -120,
            background: 'radial-gradient(circle, #FFD98A55, transparent 64%)',
        },
        b4: {
            width: 360, height: 360, bottom: -130, right: -110,
            background: 'radial-gradient(circle, #FFC15e4d, transparent 64%)',
        },
    };

    return (
        <div style={styles.bgBlobs}>
            <span style={{ ...styles.blobBase, ...styles.b1 }}></span>
            <span style={{ ...styles.blobBase, ...styles.b2 }}></span>
            <span style={{ ...styles.blobBase, ...styles.b3 }}></span>
            <span style={{ ...styles.blobBase, ...styles.b4 }}></span>
        </div>
    );
}

export default BackgroundOrbs;
