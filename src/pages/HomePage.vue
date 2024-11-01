<template>
    <div class="home-page">

        <div class="container">
            <svg class="brain-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                    d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z">
                </path>
                <path
                    d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z">
                </path>
            </svg>
            <h1>Sound Smarter</h1>
            <p class="tagline">Elevate your language. Impress in any tongue.</p>
            <a href="/translate" class="cta-button">Start Sounding Smarter</a>
            <div class="features">
                <div class="feature">
                    <h3>Intelligent Conversion</h3>
                    <p>Transform your text into eloquent prose</p>
                </div>
                <div class="feature">
                    <h3>Multilingual Support</h3>
                    <p>Sound smarter in numerous languages</p>
                </div>
                <div class="feature">
                    <h3>Instant Results</h3>
                    <p>Get smarter-sounding text in seconds</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "HomePage",
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.home-page {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
}

.container {
    max-width: 800px;
    padding: 2rem;
    text-align: center;
}

h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.tagline {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    display: inline-block;
    background-color: #ffd700;
    color: #333;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.brain-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
}

.features {
    display: flex;
    justify-content: space-around;
    margin-top: 3rem;
}

.feature {
    flex-basis: 30%;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.feature h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.feature p {
    font-size: 0.9rem;
    opacity: 0.8;
}

@media (max-width: 1000px) {
    .features {
        flex-direction: column;
    }

    .feature {
        margin-top: 10px;
        padding: 1rem;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }
}
</style>
