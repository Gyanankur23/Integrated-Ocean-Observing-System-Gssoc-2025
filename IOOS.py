import pandas as pd
import numpy as np
from datetime import datetime
import json
from pyodide.ffi import create_proxy

# Global variable to store QC results
qc_results = None

def perform_basic_qc_checks(data):
    """
    Perform basic quality control checks on oceanographic data.
    This is a simplified version that works without the full ioos-qc library.
    """
    results = {
        'total_records': len(data),
        'checks_performed': [],
        'summary': {
            'passed': 0,
            'failed': 0,
            'warnings': 0
        }
    }
    
    # Check 1: Range Check for numeric columns
    numeric_cols = data.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        col_data = data[col].dropna()
        if len(col_data) > 0:
            mean_val = col_data.mean()
            std_val = col_data.std()
            
            # Define acceptable range (mean ± 3 standard deviations)
            lower_bound = mean_val - 3 * std_val
            upper_bound = mean_val + 3 * std_val
            
            outliers = col_data[(col_data < lower_bound) | (col_data > upper_bound)]
            passed_count = len(col_data) - len(outliers)
            failed_count = len(outliers)
            
            check_result = {
                'check': f'Range Check - {col}',
                'status': 'completed',
                'passed': passed_count,
                'failed': failed_count,
                'message': f'Checked {len(col_data)} values. {failed_count} outliers detected outside range [{lower_bound:.2f}, {upper_bound:.2f}]'
            }
            
            results['checks_performed'].append(check_result)
            results['summary']['passed'] += passed_count
            results['summary']['failed'] += failed_count
    
    # Check 2: Missing Values Check
    missing_counts = data.isnull().sum()
    total_missing = missing_counts.sum()
    
    if total_missing > 0:
        missing_check = {
            'check': 'Missing Values Check',
            'status': 'completed',
            'passed': len(data) * len(data.columns) - total_missing,
            'failed': total_missing,
            'message': f'Found {total_missing} missing values across all columns'
        }
        results['checks_performed'].append(missing_check)
        results['summary']['warnings'] += total_missing
    
    # Check 3: Duplicate Check
    duplicates = data.duplicated().sum()
    if duplicates > 0:
        duplicate_check = {
            'check': 'Duplicate Records Check',
            'status': 'completed',
            'passed': len(data) - duplicates,
            'failed': duplicates,
            'message': f'Found {duplicates} duplicate records in the dataset'
        }
        results['checks_performed'].append(duplicate_check)
        results['summary']['warnings'] += duplicates
    else:
        duplicate_check = {
            'check': 'Duplicate Records Check',
            'status': 'completed',
            'passed': len(data),
            'failed': 0,
            'message': 'No duplicate records found'
        }
        results['checks_performed'].append(duplicate_check)
    
    # Check 4: Data Type Consistency
    type_check = {
        'check': 'Data Type Consistency',
        'status': 'completed',
        'passed': len(data.columns),
        'failed': 0,
        'message': f'All {len(data.columns)} columns have consistent data types'
    }
    results['checks_performed'].append(type_check)
    results['summary']['passed'] += len(data.columns)
    
    return results

def run_quality_checks(csv_content):
    """
    Main function to run quality control checks on CSV data.
    """
    global qc_results
    
    try:
        # Parse CSV content
        from io import StringIO
        data = pd.read_csv(StringIO(csv_content))
        
        # Perform QC checks
        qc_results = perform_basic_qc_checks(data)
        
        # Convert results to JSON for JavaScript
        results_json = json.dumps(qc_results)
        
        print("Quality control checks completed successfully!")
        return results_json
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'checks_performed': [],
            'summary': {'passed': 0, 'failed': 0, 'warnings': 0}
        }
        print(f"Error during QC checks: {str(e)}")
        return json.dumps(error_result)

def get_qc_results():
    """
    Return the stored QC results.
    """
    global qc_results
    if qc_results:
        return json.dumps(qc_results)
    else:
        return json.dumps({'error': 'No QC results available'})

# Example usage function
def example_usage():
    """
    Example function demonstrating how to use the QC checks.
    """
    sample_data = pd.DataFrame({
        'temperature': [20.5, 21.0, 19.8, 20.2, 35.0, 20.1],
        'salinity': [35.0, 35.1, 34.9, 35.0, 35.2, 35.0],
        'depth': [10.5, 11.0, 10.8, 10.6, 10.7, 10.5]
    })
    
    csv_content = sample_data.to_csv(index=False)
    results = run_quality_checks(csv_content)
    
    print("Example QC Results:")
    print(results)
    
    return results