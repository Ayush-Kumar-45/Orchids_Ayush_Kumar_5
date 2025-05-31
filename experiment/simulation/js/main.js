// Global variables
let scene, camera, renderer, orbitalMesh, controls;
let moChart;
let simulationStarted = false;
let animationId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    document.getElementById('atomicNum1').addEventListener('input', function() {
        document.getElementById('runBtn').disabled = true;
    });
    document.getElementById('atomicNum2').addEventListener('input', function() {
        document.getElementById('runBtn').disabled = true;
    });
    
    // Start button
    document.getElementById('startBtn').addEventListener('click', function() {
        simulationStarted = true;
        document.getElementById('runBtn').disabled = false;
        updateSimulation();
    });
    
    // Run button
    document.getElementById('runBtn').addEventListener('click', function() {
        if (simulationStarted) {
            updateSimulation();
        }
    });
    
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
            
            // If switching to 3D tab, resize the renderer
            if (this.dataset.tab === '3d-visualization') {
                setTimeout(() => {
                    if (renderer) {
                        const container = document.getElementById('orbital3d');
                        const width = container.clientWidth;
                        const height = container.clientHeight;
                        
                        renderer.setSize(width, height);
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        
                        // Re-center the orbital
                        if (orbitalMesh) {
                            orbitalMesh.position.set(0, 0, 0);
                        }
                    }
                }, 100);
            }
        });
    });
    
    // Orbital selection for 3D view
    document.getElementById('orbitalSelect').addEventListener('change', update3dOrbital);
    
    // Initialize the MO diagram
    initMOChart();
    
    // Initialize 3D visualization (but don't render until tab is active)
    init3DScene();
});

// Initialize the MO diagram chart
function initMOChart() {
    const ctx = document.getElementById('moDiagram').getContext('2d');
    
    moChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Energy Level',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                barThickness: 20
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    display: false,
                    min: -10,
                    max: 0
                },
                y: {
                    ticks: {
                        crossAlign: 'far',
                        mirror: true,
                        z: 10,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.x.toFixed(1)} eV`;
                        },
                        afterLabel: function(context) {
                            const orbital = context.dataset.orbitals[context.dataIndex];
                            let info = `Type: ${orbital.type === 'bonding' ? 'Bonding' : 'Antibonding'}`;
                            if (orbital.electrons > 0) {
                                info += `\nElectrons: ${orbital.electrons}`;
                            }
                            return info;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Initialize the 3D scene
function init3DScene() {
    const container = document.getElementById('orbital3d');
    
    // Set up the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    
    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbital placeholder
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x4a6fa5,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    orbitalMesh = new THREE.Mesh(geometry, material);
    scene.add(orbitalMesh);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    
    // Add orbital controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Only render if the 3D visualization tab is active
    if (document.getElementById('3d-visualization').classList.contains('active')) {
        controls.update();
        renderer.render(scene, camera);
    }
}

// Update the 3D orbital visualization based on selection
function update3dOrbital() {
    const selectedOrbital = document.getElementById('orbitalSelect').value;
    
    // Remove previous orbital if it exists
    if (orbitalMesh) {
        scene.remove(orbitalMesh);
    }
    
    // Create new orbital based on selection
    let geometry, material;
    let color = 0x4a6fa5; // Default bonding color (blue)
    let isAntibonding = false;
    
    if (selectedOrbital.includes('Star')) {
        color = 0xff6b6b; // Antibonding color (red)
        isAntibonding = true;
    }
    
    switch(selectedOrbital) {
        case 'sigma2s':
            geometry = new THREE.SphereGeometry(1, 32, 32);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7
            });
            break;
            
        case 'sigma2sStar':
            geometry = new THREE.SphereGeometry(1, 32, 32);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                wireframe: true
            });
            break;
            
        case 'sigma2pz':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            break;
            
        case 'pi2px':
            geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
            geometry.rotateY(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            break;
            
        case 'pi2py':
            geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            break;
            
        case 'pi2pxStar':
            geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
            geometry.rotateY(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                wireframe: true,
                side: THREE.DoubleSide
            });
            break;
            
        case 'pi2pyStar':
            geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                wireframe: true,
                side: THREE.DoubleSide
            });
            break;
            
        case 'sigma2pzStar':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
            geometry.rotateX(Math.PI / 2);
            material = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7,
                wireframe: true,
                side: THREE.DoubleSide
            });
            break;
    }
    
    orbitalMesh = new THREE.Mesh(geometry, material);
    scene.add(orbitalMesh);
    
    // Reset camera position
    camera.position.z = 5;
    controls.reset();
}

// Main update function for the simulation
function updateSimulation() {
    if (!simulationStarted) return;
    
    const atomicNum1 = parseInt(document.getElementById('atomicNum1').value);
    const atomicNum2 = parseInt(document.getElementById('atomicNum2').value);
    
    // Update total electrons
    const totalElectrons = atomicNum1 + atomicNum2;
    document.getElementById('totalElectrons').textContent = totalElectrons;
    
    // Generate MO configuration based on the larger atomic number
    const largerZ = Math.max(atomicNum1, atomicNum2);
    const orbitals = generateMOConfig(largerZ);
    
    // Fill electrons
    const electronConfig = fillElectrons(orbitals, totalElectrons);
    
    // Calculate bond order and magnetic properties
    const { bondOrder, magneticBehavior } = calculateProperties(electronConfig);
    
    // Update UI
    document.getElementById('bondOrder').textContent = bondOrder.toFixed(1);
    document.getElementById('magneticBehavior').textContent = magneticBehavior;
    
    // Update MO diagram
    updateMOChart(orbitals, electronConfig);
    
    // Update orbital table
    updateOrbitalTable(orbitals, electronConfig);
    
    // Update 3D visualization if on that tab
    if (document.getElementById('3d-visualization').classList.contains('active')) {
        update3dOrbital();
    }
}

// Generate MO configuration based on atomic number
function generateMOConfig(Z) {
    if (Z < 8) {
        return [
            { name: 'σ(2s)', energy: -8, type: 'bonding', description: 'Bonding orbital formed by s-s overlap' },
            { name: 'σ*(2s)', energy: -6, type: 'antibonding', description: 'Antibonding orbital from s-s overlap' },
            { name: 'π(2px)', energy: -3, type: 'bonding', description: 'Bonding orbital from p-p side overlap (x-axis)' },
            { name: 'π(2py)', energy: -3, type: 'bonding', description: 'Bonding orbital from p-p side overlap (y-axis)' },
            { name: 'σ(2pz)', energy: -4, type: 'bonding', description: 'Bonding orbital from p-p head-on overlap (z-axis)' },
            { name: 'π*(2px)', energy: -2, type: 'antibonding', description: 'Antibonding orbital from p-p side overlap (x-axis)' },
            { name: 'π*(2py)', energy: -2, type: 'antibonding', description: 'Antibonding orbital from p-p side overlap (y-axis)' },
            { name: 'σ*(2pz)', energy: -1, type: 'antibonding', description: 'Antibonding orbital from p-p head-on overlap (z-axis)' }
        ];
    } else {
        return [
            { name: 'σ(2s)', energy: -8, type: 'bonding', description: 'Bonding orbital formed by s-s overlap' },
            { name: 'σ*(2s)', energy: -6, type: 'antibonding', description: 'Antibonding orbital from s-s overlap' },
            { name: 'σ(2pz)', energy: -4, type: 'bonding', description: 'Bonding orbital from p-p head-on overlap (z-axis)' },
            { name: 'π(2px)', energy: -3, type: 'bonding', description: 'Bonding orbital from p-p side overlap (x-axis)' },
            { name: 'π(2py)', energy: -3, type: 'bonding', description: 'Bonding orbital from p-p side overlap (y-axis)' },
            { name: 'π*(2px)', energy: -2, type: 'antibonding', description: 'Antibonding orbital from p-p side overlap (x-axis)' },
            { name: 'π*(2py)', energy: -2, type: 'antibonding', description: 'Antibonding orbital from p-p side overlap (y-axis)' },
            { name: 'σ*(2pz)', energy: -1, type: 'antibonding', description: 'Antibonding orbital from p-p head-on overlap (z-axis)' }
        ];
    }
}

// Fill electrons into orbitals
function fillElectrons(orbitals, totalElectrons) {
    let remaining = totalElectrons;
    const electronConfig = [];
    
    for (const orbital of orbitals) {
        if (remaining >= 2) {
            electronConfig.push({ ...orbital, electrons: 2, spin: 'paired' });
            remaining -= 2;
        } else if (remaining === 1) {
            electronConfig.push({ ...orbital, electrons: 1, spin: 'up' });
            remaining -= 1;
        } else {
            electronConfig.push({ ...orbital, electrons: 0, spin: null });
        }
    }
    
    return electronConfig;
}

// Calculate bond order and magnetic properties
function calculateProperties(electronConfig) {
    let bondingElectrons = 0;
    let antibondingElectrons = 0;
    let unpairedElectrons = 0;
    
    for (const orbital of electronConfig) {
        if (orbital.type === 'bonding') {
            bondingElectrons += orbital.electrons;
        } else if (orbital.type === 'antibonding') {
            antibondingElectrons += orbital.electrons;
        }
        
        if (orbital.electrons === 1) {
            unpairedElectrons++;
        }
    }
    
    const bondOrder = (bondingElectrons - antibondingElectrons) / 2;
    const magneticBehavior = unpairedElectrons > 0 ? 'Paramagnetic' : 'Diamagnetic';
    
    return { bondOrder, magneticBehavior };
}

// Update the MO chart
function updateMOChart(orbitals, electronConfig) {
    // Prepare data for chart
    const labels = electronConfig.map(orbital => orbital.name);
    const data = electronConfig.map(orbital => orbital.energy);
    const backgroundColors = electronConfig.map(orbital => 
        orbital.type === 'bonding' ? 'rgba(74, 111, 165, 0.7)' : 'rgba(255, 107, 107, 0.7)'
    );
    const borderColors = electronConfig.map(orbital => 
        orbital.type === 'bonding' ? 'rgba(74, 111, 165, 1)' : 'rgba(255, 107, 107, 1)'
    );
    
    // Update chart data
    moChart.data.labels = labels;
    moChart.data.datasets[0].data = data;
    moChart.data.datasets[0].backgroundColor = backgroundColors;
    moChart.data.datasets[0].borderColor = borderColors;
    moChart.data.datasets[0].orbitals = electronConfig;
    
    // Add electron annotations
    if (moChart.options.plugins.annotation) {
        delete moChart.options.plugins.annotation;
    }
    
    moChart.options.plugins.annotation = {
        annotations: []
    };
    
    electronConfig.forEach((orbital, index) => {
        if (orbital.electrons > 0) {
            // First electron
            moChart.options.plugins.annotation.annotations.push({
                type: 'point',
                xValue: orbital.energy + 0.3,
                yValue: index,
                radius: 5,
                backgroundColor: 'black',
                borderColor: 'black'
            });
            
            // Second electron (if exists)
            if (orbital.electrons === 2) {
                moChart.options.plugins.annotation.annotations.push({
                    type: 'point',
                    xValue: orbital.energy + 0.6,
                    yValue: index,
                    radius: 5,
                    backgroundColor: 'red',
                    borderColor: 'red'
                });
            }
        }
    });
    
    moChart.update();
}

// Update the orbital table
function updateOrbitalTable(orbitals, electronConfig) {
    const tableBody = document.getElementById('orbitalTableBody');
    tableBody.innerHTML = '';
    
    electronConfig.forEach(orbital => {
        const row = document.createElement('tr');
        
        // Orbital name
        const nameCell = document.createElement('td');
        nameCell.textContent = orbital.name;
        row.appendChild(nameCell);
        
        // Electrons
        const electronsCell = document.createElement('td');
        if (orbital.electrons > 0) {
            const electron1 = document.createElement('span');
            electron1.className = 'electron electron-up';
            electronsCell.appendChild(electron1);
            
            if (orbital.electrons === 2) {
                const electron2 = document.createElement('span');
                electron2.className = 'electron electron-down';
                electronsCell.appendChild(electron2);
            }
        } else {
            electronsCell.textContent = '0';
        }
        row.appendChild(electronsCell);
        
        // Type
        const typeCell = document.createElement('td');
        typeCell.textContent = orbital.type === 'bonding' ? 'Bonding' : 'Antibonding';
        row.appendChild(typeCell);
        
        // Energy level
        const energyCell = document.createElement('td');
        energyCell.textContent = `${orbital.energy.toFixed(1)} eV`;
        row.appendChild(energyCell);
        
        // Description
        const descCell = document.createElement('td');
        descCell.textContent = orbital.description;
        row.appendChild(descCell);
        
        tableBody.appendChild(row);
    });
}