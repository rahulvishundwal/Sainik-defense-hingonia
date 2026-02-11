#!/usr/bin/env python3
"""
Generate Professional Admission Form PDF
For Sainik Defense College
"""

import sys
import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def generate_admission_pdf(data, output_path):
    """Generate a professional admission form PDF"""
    
    # Create PDF
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                           leftMargin=0.75*inch, rightMargin=0.75*inch,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#374151'),
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.white,
        spaceAfter=10,
        spaceBefore=15,
        backColor=colors.HexColor('#1a365d'),
        leftIndent=10,
        fontName='Helvetica-Bold'
    )
    
    # Header
    story.append(Paragraph("🛡️", title_style))
    story.append(Paragraph("SAINIK DEFENSE COLLEGE", title_style))
    story.append(Paragraph("Hingonia, Jaipur, Rajasthan - 302026", subtitle_style))
    story.append(Paragraph("Affiliated to CBSE, New Delhi", subtitle_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Form title
    story.append(Paragraph("ADMISSION FORM", heading_style))
    story.append(Spacer(1, 0.15*inch))
    
    # Application details box
    app_data = [
        ['Application ID:', f"#{data.get('id', 'N/A')}"],
        ['Application Date:', data.get('submitted_at', 'N/A')]
    ]
    
    app_table = Table(app_data, colWidths=[2*inch, 3*inch])
    app_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e5e7eb')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1a365d')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(app_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Student Information
    story.append(Paragraph("STUDENT INFORMATION", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    student_data = [
        ['Student Name:', data.get('student_name', ''), 'Date of Birth:', data.get('dob', '')],
        ['Father\'s Name:', data.get('father_name', ''), 'Gender:', data.get('gender', '')],
        ['Mother\'s Name:', data.get('mother_name', ''), 'Blood Group:', data.get('blood_group', 'N/A')],
        ['Class Applying For:', data.get('class_applying', ''), 'Previous School:', data.get('previous_school', 'N/A')],
    ]
    
    student_table = Table(student_data, colWidths=[1.5*inch, 2.2*inch, 1.3*inch, 2*inch])
    student_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#dbeafe')),
        ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1a365d')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTNAME', (3, 0), (3, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(student_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Contact Information
    story.append(Paragraph("CONTACT INFORMATION", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    contact_data = [
        ['Email Address:', data.get('email', '')],
        ['Phone Number:', data.get('phone', '')],
        ['Residential Address:', data.get('address', '')],
    ]
    
    contact_table = Table(contact_data, colWidths=[1.8*inch, 5.2*inch])
    contact_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1a365d')),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(contact_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Office Use Section
    story.append(Paragraph("FOR OFFICE USE ONLY", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    office_data = [
        ['Admission Status:', '☐ Approved   ☐ Pending   ☐ Rejected'],
        ['Interview Date:', ''],
        ['Admission Fee Paid:', '☐ Yes   ☐ No     Amount: ₹ __________'],
        ['Receipt Number:', ''],
        ['Admitted to Class:', ''],
        ['Roll Number Assigned:', ''],
        ['Remarks:', ''],
    ]
    
    office_table = Table(office_data, colWidths=[2*inch, 5*inch])
    office_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#fef3c7')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1a365d')),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#fbbf24')),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(office_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Signature section
    signature_data = [
        ['', '', ''],
        ['___________________', '___________________', '___________________'],
        ['Parent/Guardian Signature', 'Admission Officer', 'Principal Signature'],
    ]
    
    signature_table = Table(signature_data, colWidths=[2.3*inch, 2.3*inch, 2.3*inch])
    signature_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 2), (-1, 2), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#374151')),
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
    ]))
    story.append(signature_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("_" * 100, footer_style))
    story.append(Paragraph("Sainik Defense College, Hingonia, Jaipur | Ph: +91 141 XXXXXXX | Email: admissions@sainikdefense.com", footer_style))
    story.append(Paragraph(f"Document Generated: {datetime.now().strftime('%d-%b-%Y %I:%M %p')}", footer_style))
    
    # Build PDF
    doc.build(story)
    print(f"PDF generated successfully: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_admission_pdf.py <json_data> <output_path>")
        sys.exit(1)
    
    json_data = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        data = json.loads(json_data)
        generate_admission_pdf(data, output_path)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
