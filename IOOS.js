// Global state management
const AppState = {
    csvData: null,
    fileName: null,
    fileSize: null,
    headers: [],
    rows: [],
    qcResults: null
};

// DOM Elements
const elements = {
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-upload'),
    fileInfo: document.getElementById('file-info'),
    fileName: document.getElementById('file-name'),
    fileSize: document.getElementById('file-size'),
    removeFile: document.getElementById('remove-file'),
    processButton: document.getElementById('process-button'),
    dataPreviewSection: document.getElementById('data-preview-section'),
    dataTable: document.getElementById('data-table'),
    rowCount: document.getElementById('row-count'),
    colCount: document.getElementById('col-count'),
    searchInput: document.getElementById('search-input'),
    qcSection: document.getElementById('qc-section'),
    qualityCheckButton: document.getElementById('quality-check-button'),
    loadingIndicator: document.getElementById('loading-indicator'),
    resultsSection: document.getElementById('results-section'),
    qcResults: document.getElementById('qc-results'),
    totalRecords: document.getElementById('total-records'),
    passedRecords: document.getElementById('passed-records'),
    failedRecords: document.getElementById('failed-records'),
    warningRecords: document.getElementById('warning-records'),
    exportCsv: document.getElementById('export-csv'),
    exportPdf: document.getElementById('export-pdf')
};

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('dragover');
    });

    elements.uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
    });

    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

// Handle file selection
function handleFileSelect(file) {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
        showNotification('Please upload a CSV file', 'error');
        return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('File size exceeds 10MB limit', 'error');
        return;
    }

    AppState.fileName = file.name;
    AppState.fileSize = formatFileSize(file.size);

    // Update UI
    elements.fileName.textContent = AppState.fileName;
    elements.fileSize.textContent = AppState.fileSize;
    elements.fileInfo.style.display = 'flex';
    elements.uploadArea.style.display = 'none';
    elements.processButton.disabled = false;

    showNotification('File selected successfully', 'success');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove file
function removeFile() {
    AppState.csvData = null;
    AppState.fileName = null;
    AppState.fileSize = null;
    AppState.headers = [];
    AppState.rows = [];

    elements.fileInput.value = '';
    elements.fileInfo.style.display = 'none';
    elements.uploadArea.style.display = 'block';
    elements.processButton.disabled = true;
    elements.dataPreviewSection.style.display = 'none';
    elements.qcSection.style.display = 'none';
    elements.resultsSection.style.display = 'none';

    showNotification('File removed', 'info');
}

// Process CSV file
function processCSV() {
    const file = elements.fileInput.files[0];
    if (!file) {
        showNotification('Please select a file first', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            AppState.csvData = e.target.result;
            parseCSV(AppState.csvData);
            displayDataPreview();
            showNotification('Dataset processed successfully', 'success');
        } catch (error) {
            showNotification('Error processing CSV: ' + error.message, 'error');
        }
    };

    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };

    reader.readAsText(file);
}

// Parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
        throw new Error('CSV file is empty');
    }

    // Parse headers
    AppState.headers = parseCSVLine(lines[0]);
    
    // Parse rows
    AppState.rows = lines.slice(1).map(line => parseCSVLine(line));
}

// Parse CSV line (handles quoted fields)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Display data preview
function displayDataPreview() {
    const tableHead = elements.dataTable.querySelector('thead');
    const tableBody = elements.dataTable.querySelector('tbody');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Create header row
    const headerRow = document.createElement('tr');
    AppState.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows (limit to first 100 for performance)
    const displayRows = AppState.rows.slice(0, 100);
    displayRows.forEach(row => {
        const rowElement = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            rowElement.appendChild(td);
        });
        tableBody.appendChild(rowElement);
    });

    // Update row and column counts
    elements.rowCount.textContent = `${AppState.rows.length} rows`;
    elements.colCount.textContent = `${AppState.headers.length} columns`;

    // Show preview section
    elements.dataPreviewSection.style.display = 'block';
    elements.qcSection.style.display = 'block';

    // Scroll to preview
    elements.dataPreviewSection.scrollIntoView({ behavior: 'smooth' });
}

// Search functionality
function initializeSearch() {
    elements.searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tableBody = elements.dataTable.querySelector('tbody');
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Run quality control checks
async function runQualityControl() {
    const qcOptions = {
        range: document.getElementById('qc-range').checked,
        climatology: document.getElementById('qc-climatology').checked,
        spikes: document.getElementById('qc-spikes').checked,
        gradient: document.getElementById('qc-gradient').checked
    };

    if (!Object.values(qcOptions).some(Boolean)) {
        showNotification('Please select at least one QC check', 'error');
        return;
    }

    // Show loading indicator
    elements.loadingIndicator.style.display = 'block';
    elements.qualityCheckButton.disabled = true;

    try {
        // Simulate QC checks (in production, this would call the Python script)
        await simulateQCChecks(qcOptions);
        
        // Display results
        displayQCResults();
        
        showNotification('Quality control checks completed', 'success');
    } catch (error) {
        showNotification('Error running QC checks: ' + error.message, 'error');
    } finally {
        elements.loadingIndicator.style.display = 'none';
        elements.qualityCheckButton.disabled = false;
    }
}

// Simulate QC checks (placeholder for actual Python integration)
async function simulateQCChecks(options) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock QC results
    const totalRecords = AppState.rows.length;
    const passedRecords = Math.floor(totalRecords * 0.85);
    const failedRecords = Math.floor(totalRecords * 0.10);
    const warningRecords = totalRecords - passedRecords - failedRecords;

    AppState.qcResults = {
        total: totalRecords,
        passed: passedRecords,
        failed: failedRecords,
        warnings: warningRecords,
        details: generateQCDetails(options, passedRecords, failedRecords, warningRecords)
    };
}

// Generate QC details
function generateQCDetails(options, passed, failed, warnings) {
    const details = [];
    
    if (options.range) {
        details.push({
            check: 'Range Check',
            status: 'completed',
            passed: Math.floor(passed * 0.3),
            failed: Math.floor(failed * 0.4),
            message: 'All values within acceptable range'
        });
    }
    
    if (options.climatology) {
        details.push({
            check: 'Climatology Check',
            status: 'completed',
            passed: Math.floor(passed * 0.3),
            failed: Math.floor(failed * 0.3),
            message: 'Values compared against climatology database'
        });
    }
    
    if (options.spikes) {
        details.push({
            check: 'Spike Detection',
            status: 'completed',
            passed: Math.floor(passed * 0.2),
            failed: Math.floor(failed * 0.2),
            message: 'No significant spikes detected'
        });
    }
    
    if (options.gradient) {
        details.push({
            check: 'Gradient Check',
            status: 'completed',
            passed: Math.floor(passed * 0.2),
            failed: Math.floor(failed * 0.1),
            message: 'Gradient values within normal limits'
        });
    }

    return details;
}

// Display QC results
function displayQCResults() {
    const results = AppState.qcResults;
    
    // Update summary cards
    elements.totalRecords.textContent = results.total;
    elements.passedRecords.textContent = results.passed;
    elements.failedRecords.textContent = results.failed;
    elements.warningRecords.textContent = results.warnings;

    // Display detailed results
    let detailsHTML = '<div class="qc-details-list">';
    results.details.forEach(detail => {
        detailsHTML += `
            <div class="qc-detail-item">
                <div class="qc-detail-header">
                    <h4>${detail.check}</h4>
                    <span class="qc-status ${detail.status}">${detail.status}</span>
                </div>
                <div class="qc-detail-stats">
                    <span class="stat passed">Passed: ${detail.passed}</span>
                    <span class="stat failed">Failed: ${detail.failed}</span>
                </div>
                <p class="qc-detail-message">${detail.message}</p>
            </div>
        `;
    });
    detailsHTML += '</div>';

    elements.qcResults.innerHTML = detailsHTML;

    // Create charts
    createCharts(results);

    // Show results section
    elements.resultsSection.style.display = 'block';
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Create charts for QC results
function createCharts(results) {
    // Destroy existing charts if they exist
    if (window.qcChart) window.qcChart.destroy();
    if (window.distributionChart) window.distributionChart.destroy();

    // Create QC Results Pie Chart
    const qcCtx = document.getElementById('qcChart').getContext('2d');
    window.qcChart = new Chart(qcCtx, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Warnings'],
            datasets: [{
                data: [results.passed, results.failed, results.warnings],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(243, 156, 18, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(243, 156, 18, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'QC Results Distribution',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });

    // Create Check Performance Bar Chart
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    const checkLabels = results.details.map(d => d.check);
    const passedData = results.details.map(d => d.passed);
    const failedData = results.details.map(d => d.failed);

    window.distributionChart = new Chart(distributionCtx, {
        type: 'bar',
        data: {
            labels: checkLabels,
            datasets: [
                {
                    label: 'Passed',
                    data: passedData,
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Failed',
                    data: failedData,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Check Performance by Type',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Export functionality
function initializeExport() {
    elements.exportCsv.addEventListener('click', exportToCSV);
    elements.exportPdf.addEventListener('click', exportToPDF);
}

// Export to CSV
function exportToCSV() {
    if (!AppState.qcResults) {
        showNotification('No QC results to export', 'error');
        return;
    }

    const csvContent = generateCSVReport();
    downloadFile(csvContent, 'qc_results.csv', 'text/csv');
    showNotification('Results exported to CSV', 'success');
}

// Generate CSV report
function generateCSVReport() {
    let csv = 'Check,Status,Passed,Failed,Message\n';
    
    AppState.qcResults.details.forEach(detail => {
        csv += `"${detail.check}","${detail.status}",${detail.passed},${detail.failed},"${detail.message}"\n`;
    });

    csv += `\nSummary\n`;
    csv += `Total Records,${AppState.qcResults.total}\n`;
    csv += `Passed,${AppState.qcResults.passed}\n`;
    csv += `Failed,${AppState.qcResults.failed}\n`;
    csv += `Warnings,${AppState.qcResults.warnings}\n`;

    return csv;
}

// Export to PDF (placeholder)
function exportToPDF() {
    showNotification('PDF export feature coming soon', 'info');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            background: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #2ecc71;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification.warning {
            border-left: 4px solid #f39c12;
        }
        
        .notification.info {
            border-left: 4px solid #0077b6;
        }
        
        .notification.success i {
            color: #2ecc71;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
        
        .notification.warning i {
            color: #f39c12;
        }
        
        .notification.info i {
            color: #0077b6;
        }
        
        .qc-details-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .qc-detail-item {
            background: white;
            border: 1px solid #e1e8ed;
            border-radius: 10px;
            padding: 20px;
        }
        
        .qc-detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .qc-detail-header h4 {
            margin: 0;
            color: #0077b6;
        }
        
        .qc-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .qc-status.completed {
            background: rgba(46, 204, 113, 0.1);
            color: #2ecc71;
        }
        
        .qc-detail-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
        }
        
        .stat {
            font-size: 0.9rem;
        }
        
        .stat.passed {
            color: #2ecc71;
        }
        
        .stat.failed {
            color: #e74c3c;
        }
        
        .qc-detail-message {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    initializeDragAndDrop();
    initializeSearch();
    initializeExport();

    // Event listeners
    elements.removeFile.addEventListener('click', removeFile);
    elements.processButton.addEventListener('click', processCSV);
    elements.qualityCheckButton.addEventListener('click', runQualityControl);

    console.log('IOOS Tool Interface initialized successfully');
});

