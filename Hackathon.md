# GSSOC 2025 Hackathon: IOOS Tool Data Interface

## Project Overview
This project was developed for the Google Summer of Code 2025 Hackathon, focusing on the Integrated Ocean Observing System (IOOS). The goal is to create web-based user interfaces for IOOS tools, making oceanographic data quality control more accessible and user-friendly.

## Problem Statement
Oceanographic researchers and data scientists often face challenges in accessing and utilizing IOOS quality control tools. The existing command-line interfaces and complex workflows create barriers to entry, limiting the adoption of these powerful data validation tools.

## Solution
We developed a modern web-based interface that brings IOOS quality control tools to the browser. Using Pyodide and PyScript, we've created an intuitive interface that allows users to upload datasets, preview data, and run quality control checks directly in their web browser without any local setup.

## Technologies Used
- **Pyodide**: Python runtime for the browser
- **PyScript**: Framework for running Python in HTML
- **ioos-qc**: IOOS quality control library
- **Pandas**: Data manipulation and analysis
- **HTML5/CSS3**: Modern web interface
- **JavaScript**: Client-side file handling and DOM manipulation
- **Vercel**: Cloud deployment platform

## Methodology
1. **Research**: Analyzed IOOS tool requirements and user workflows
2. **Design**: Created intuitive web interface for data upload and QC checks
3. **Implementation**: Built PyScript integration for running Python QC checks in browser
4. **Testing**: Validated CSV parsing, data visualization, and QC result display
5. **Deployment**: Configured Vercel for production deployment

## Key Features
- **Browser-based QC**: Run IOOS quality control checks without local Python installation
- **CSV Upload**: Drag-and-drop or click-to-upload dataset files
- **Data Preview**: Interactive table view of uploaded oceanographic data
- **Real-time QC**: Instant quality control results with detailed feedback
- **Responsive Design**: Mobile-friendly interface for field researchers

## Architecture
- **Frontend**: HTML5/CSS3 with vanilla JavaScript
- **Backend Logic**: Python (Pyodide) running in browser
- **Data Processing**: Pandas for CSV manipulation
- **Quality Control**: ioos-qc library for oceanographic data validation

## Usage Instructions
1. Open the deployed application in your web browser
2. Click "Upload Dataset" and select a CSV file containing oceanographic data
3. Preview the uploaded data in the interactive table
4. Click "Run Quality Control (QC) Checks" to validate the data
5. Review QC results displayed below the data table

## Deployment
This project is deployed on Vercel for continuous availability and easy access.

## Future Enhancements
- Support for additional file formats (NetCDF, JSON)
- Advanced visualization with interactive charts
- Custom QC configuration through UI
- Export QC reports in multiple formats
- Authentication and user-specific data storage

## Contact Information
- **Contributor**: Gyanankur Baruah
- **Email**: gyanankurcricket20@gmail.com
- **GitHub**: https://github.com/Gyanankur23/Integrated-Ocean-Observing-System-Gssoc-2025
- **Hackathon**: GSSOC 2025
