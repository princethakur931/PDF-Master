#!/usr/bin/env python3
"""
Validate requirements.txt for duplicate packages
Run this before committing changes to requirements.txt
"""

def validate_requirements(file_path='requirements.txt'):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    packages = {}
    duplicates = []
    
    for line_num, line in enumerate(lines, 1):
        line = line.strip()
        if line and not line.startswith('#') and '==' in line:
            package_name = line.split('==')[0].strip().lower()
            if package_name in packages:
                duplicates.append({
                    'package': package_name,
                    'line1': packages[package_name],
                    'line2': line_num,
                    'version1': lines[packages[package_name]-1].strip(),
                    'version2': line
                })
            else:
                packages[package_name] = line_num
    
    if duplicates:
        print("❌ VALIDATION FAILED: Duplicate packages found!\n")
        for dup in duplicates:
            print(f"Package: {dup['package']}")
            print(f"  Line {dup['line1']}: {dup['version1']}")
            print(f"  Line {dup['line2']}: {dup['version2']}")
            print()
        return False
    else:
        print("✅ VALIDATION PASSED: No duplicate packages found!")
        return True

if __name__ == '__main__':
    import sys
    success = validate_requirements()
    sys.exit(0 if success else 1)
