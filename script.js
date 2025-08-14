// --- 3D BACKGROUND SCRIPT ---
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x818cf8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = -0.1 * elapsedTime;
        particlesMesh.rotation.x = -mouse.y * 0.2;
        particlesMesh.rotation.y += -mouse.x * 0.2;
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
});

// --- FORM VALIDATION SCRIPT ---
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    const contactWrapper = document.getElementById('contact-wrapper');
    const successMessage = document.getElementById('success-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (input, errorElement, message) => {
        input.classList.add('error');
        errorElement.textContent = message;
    };

    const clearError = (input, errorElement) => {
        input.classList.remove('error');
        errorElement.textContent = '';
    };

    const validateForm = () => {
        let isValid = true;

        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Name cannot be empty.');
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Email cannot be empty.');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        if (messageInput.value.trim() === '') {
            showError(messageInput, messageError, 'Message cannot be empty.');
            isValid = false;
        } else {
            clearError(messageInput, messageError);
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            contactWrapper.classList.add('opacity-0');
            setTimeout(() => {
                contactWrapper.classList.add('hidden');
                successMessage.classList.remove('hidden');
                setTimeout(() => {
                   successMessage.classList.remove('opacity-0', 'scale-95');
                }, 50);
            }, 500);
        }
    });
    
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateForm();
            }
        });
    });
});
