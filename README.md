# IOOS Tool Data Interface

![GSSOC 2025](https://img.shields.io/badge/GSSOC-2025-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Deployment](https://img.shields.io/badge/deployment-Vercel-black)

## 🌊 Overview

This project is part of the Google Summer of Code 2025 initiative, aimed at contributing to the IOOS (Integrated Ocean Observing System) by developing web-based user interfaces for their tools. Using Python, Pyodide, PyScript, HTML, CSS, and JavaScript, this solution streamlines data management, quality control, and user engagement.

The interface enables researchers and data scientists to perform oceanographic data quality control directly in their web browser without any local setup or installation.

## ✨ Features

- **📤 CSV Upload**: Upload oceanographic datasets in CSV format through an intuitive interface
- **👁️ Data Preview**: Interactive table view for inspecting uploaded datasets
- **🔍 Quality Control**: Run IOOS QC checks using the ioos-qc library
- **🌐 Browser-based**: No local Python installation required - everything runs in the browser
- **📱 Responsive Design**: Mobile-friendly interface for field researchers
- **⚡ Real-time Results**: Instant QC feedback and validation results

## 🏗️ Architecture

```
├── IOOS.html          # Main HTML interface
├── IOOS.css           # Styling and responsive design
├── IOOS.js            # JavaScript for file handling and DOM manipulation
├── IOOS.py            # Python script for QC checks (PyScript)
├── README.md          # Project documentation
└── Hackathon.md       # Hackathon submission details
```

## 🛠️ Technologies Used

- **Pyodide**: Python runtime for the browser
- **PyScript**: Framework for running Python in HTML
- **ioos-qc**: IOOS quality control library
- **Pandas**: Data manipulation and analysis
- **HTML5/CSS3**: Modern web interface
- **JavaScript**: Client-side file handling and DOM manipulation
- **Vercel**: Cloud deployment platform

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No local installation required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gyanankur23/Integrated-Ocean-Observing-System-Gssoc-2025.git
cd Integrated-Ocean-Observing-System-Gssoc-2025
```

2. Open `IOOS.html` in your web browser

### Usage

1. **Upload Dataset**: Click on the "Upload Dataset" button and select a CSV file containing oceanographic data
2. **Preview Data**: The uploaded dataset will be displayed in an interactive table
3. **Run QC Checks**: Click on the "Run Quality Control (QC) Checks" button to validate the data
4. **View Results**: QC results will appear below the table in the "QC Results" section

### Example Workflow

```bash
1. Upload a CSV file containing oceanographic data (e.g., temperature, salinity measurements)
2. View the dataset in the interactive table
3. Perform quality control checks (validating data entries, checking for anomalies)
4. Review QC results directly in the browser interface
```

## 🔧 Configuration

To customize quality control checks, modify the QC configuration in `IOOS.py`:

```python
# Load QC configuration (path to configuration YAML file)
qc.load_cfg("path_to_qc_config.yaml")  # Replace with your QC configuration file
```

## 🌐 Deployment

This project is deployed on Vercel. To deploy your own version:

1. Push the code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

## 📊 Project Details

- **Title**: Build Web UI Versions Using Pyodide/PyScript for IOOS Tools
- **Contributor**: Gyanankur Baruah
- **Hackathon**: GSSOC 2025
- **Purpose**: Enhance accessibility and usability of IOOS data validation tools through interactive web interfaces

## 🔗 Links

- **GitHub Repository**: https://github.com/Gyanankur23/Integrated-Ocean-Observing-System-Gssoc-2025
- **Live Demo**: [Deployed on Vercel]
- **IOOS Documentation**: https://ioos.noaa.gov/

## 📧 Contact

For inquiries or feedback:
- **Email**: gyanankurcricket20@gmail.com
- **GitHub**: https://github.com/Gyanankur23

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Summer of Code 2025
- Integrated Ocean Observing System (IOOS)
- IOOS Quality Control (ioos-qc) library
- PyScript and Pyodide communities

---

**Note**: This project is a contribution for the Google Summer of Code 2025 initiative, showcasing innovation in open-source tools and technologies to improve oceanographic data processing and accessibility.
