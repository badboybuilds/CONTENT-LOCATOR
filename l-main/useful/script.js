document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle Functionality
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const container = document.querySelector('.container');

    if (sidebarToggleBtn && sidebar && container) {
        sidebarToggleBtn.addEventListener('click', () => {
            container.classList.toggle('sidebar-collapsed');
        });
    }

    // Circular Progress Animation
    const circularProgressFg = document.getElementById('circular-progress-fg');
    if (circularProgressFg) {
        const totalLength = Math.PI * 2 * 50; // Circumference
        circularProgressFg.style.strokeDasharray = `${totalLength} ${totalLength}`;

        // Simulate progress (you'd replace this with actual data)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) {
                clearInterval(interval);
                progress = 100;
            }
            const offset = totalLength - (progress / 100) * totalLength;
            circularProgressFg.style.strokeDashoffset = offset;
        }, 100);
    }

    // Simulated Progress Bar Updates
    const updateProgressButtons = document.querySelectorAll('.update-progress-btn');
    updateProgressButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target + '-progress';
            const increment = parseInt(this.dataset.increment);
            const progressItem = document.getElementById(targetId);
            if (progressItem) {
                const bar = progressItem.querySelector('.bar-container .bar');
                const label = progressItem.querySelector('label');
                const currentValue = parseInt(bar.dataset.value);
                const totalValue = parseInt(bar.dataset.total);
                const newValue = Math.min(currentValue + increment, totalValue);
                bar.style.width = `${(newValue / totalValue) * 100}%`;
                bar.dataset.value = newValue;
                label.textContent = `${targetId.split('-')[0].charAt(0).toUpperCase() + targetId.split('-')[0].slice(1)}: ${newValue}/${totalValue}`;
            }
        });
    });

    // Simulated "Add Page" Button
    const addRowBtn = document.getElementById('add-row-btn');
    const tableBody = document.querySelector('#data-table tbody');

    if (addRowBtn && tableBody) {
        addRowBtn.addEventListener('click', () => {
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>New Skill</td>
                <td></td>
                <td>
                    <div class="bar-container">
                        <div class="bar" style="width: 20%; background-color: #f1fa8c;" data-value="20" data-total="100"></div>
                        <span class="progress-value">20</span>
                    </div>
                </td>
                <td class="xp-points">20</td>
            `;
        });
    }
});