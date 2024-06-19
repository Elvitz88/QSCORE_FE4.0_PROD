import os
import sys
current_directory = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_directory, "new_env"))
from PyQt5.QtWidgets import (QApplication, QMainWindow, QLabel, QLineEdit, QCheckBox, QVBoxLayout, 
                             QHBoxLayout, QWidget, QPushButton, QGridLayout, QFrame, QSpacerItem, 
                             QSizePolicy, QTextEdit)
from PyQt5.QtPrintSupport import QPrintDialog, QPrinter, QPrintPreviewDialog 
from PyQt5.QtCore import Qt, QPoint
from PyQt5.QtGui import QFont, QPixmap, QPainter, QImage,QFontMetrics
import qrcode
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import pandas as pd
from PyQt5 import QtGui
from PyQt5.QtCore import Qt



class App(QMainWindow):
    def __init__(self):
        super().__init__()
        
        current_directory = os.getcwd()
        icon_path = os.path.join(current_directory, 'iconscout-logo.ico')
        self.setWindowIcon(QtGui.QIcon(icon_path))
        self.title = 'Q_Sync'
        self.detail_inputs = {}  # Add this line
        print(f"Window size: {self.size().width()}x{self.size().height()}")
        print(f"Window position: {self.pos().x()}, {self.pos().y()}")

        
        self.qc1_label = QLabel("QC1")
        self.qc1_label.setAlignment(Qt.AlignRight)
        self.qc1_label.setFont(QFont("Arial",8, QFont.Bold))
        self.qc1_label.hide()  # Initially hide the label

        self.qc2_label = QLabel("QC2")
        self.qc2_label.setAlignment(Qt.AlignRight)
        self.qc2_label.setFont(QFont("Arial",8, QFont.Bold))
        self.qc2_label.hide()  # Initially hide the label

        
        # Read the Excel file
        current_directory = os.getcwd()
        file_path = os.path.join(current_directory, "Qscore", "Quality_score.xlsx")  #Path File qualityscore
        self.df = pd.read_excel(file_path)
        
        self.initUI()
        self.resize(1100,550)
        self.setFixedSize(1100,550)

    def handlePrint(self, printer):
        self.outerFrame.setFixedSize(2480, 1748)


    def print_form(self):
    # Create a QPixmap to render the content of the outerFrame
        pixmap = QPixmap(self.outerFrame.size())
        self.outerFrame.render(pixmap)

        # Setup Printer
        printer = QPrinter(QPrinter.HighResolution)
        printer.setPageSize(QPrinter.A5)
        printer.setOrientation(QPrinter.Landscape)
        printer.setResolution(700)

        # Use QPrintDialog to let user select printer and print settings
        print_dialog = QPrintDialog(printer, self)
        if print_dialog.exec_() == QPrintDialog.Accepted:
            painter = QPainter(printer)
            rect = painter.viewport()
            size = pixmap.size()
            size.scale(rect.size(), Qt.KeepAspectRatio)
            painter.setViewport(rect.x(), rect.y(), size.width(), size.height())
            painter.setWindow(pixmap.rect())
            painter.drawPixmap(0, 0, pixmap)
            painter.end()


    def clear_data(self):
        self.data_edit.clear()

    def generate_data(self):
        raw_data = self.data_edit.toPlainText().split("\n")
        data_dict = {line.split("\t")[0]: line.split("\t")[1] for line in raw_data if "\t" in line}
        
        # Create a key by concatenating the "Vendor" and "Material" fields
        key = data_dict.get("Vendor", "")+data_dict.get("Supplying Plant", "") + data_dict.get("Material", "")
        print(f"Generated key: {key}")  # Debug print
        
        # Search for the key in the first column of the dataframe
        matching_row = self.df[self.df.iloc[:, 0] == key]
        print(matching_row)  # Debug print
        
        if not matching_row.empty:
            # Retrieve the values from columns 5 and 7
            q_score = str(matching_row.iloc[0, 4])
            sampling = str(matching_row.iloc[0, 6])
        else:
            q_score = "Normal Inspection"
            sampling = "Sampling"
        
        data_dict["Q-Score"] = q_score
        data_dict["Sampling"] = sampling
            
        print(f"Q-Score: {q_score}, Sampling: {sampling}")  # Debug print

        # Map the data
        data = {
            "โรงงาน": data_dict.get("Receiving Plant", ""),
            "วันที่": data_dict.get("Queue Date", ""),
            "ลำดับคิว": data_dict.get("Queue No.", ""),
            "Inspection Lot": data_dict.get("Inspection Lot", ""),
            "Batch": data_dict.get("Batch", ""),
            "ทะเบียนรถ(หัว)": data_dict.get("Plate No. (Head)", ""),
            "ทะเบียนรถ(ท้าย)": data_dict.get("Plate No. (Tail)", ""),
            "ชื่อวัตถุดิบ": data_dict.get("Material description", ""),
            "CODE": data_dict.get("Material", ""),
            "ชื่อผู้ส่ง": data_dict.get("Vendor Name", ""),
            "CODE ผู้ส่ง": data_dict.get("Vendor", "")+data_dict.get("Supplying Plant", ""),
            "ลงชื่อ": self.sign_name_input.text(),
            "Q-Score": data_dict.get("Q-Score", ""),
            "Sampling": data_dict.get("Sampling", "")
        }
        self.populateData(data)
        self.generate_qrcode(data)
        self.generate_additional_qrcode(data)



    def fit_font_to_widget(self, widget, text):
        """Adjust font size of text to fit into the given widget."""
        font = widget.font()
        fm = QFontMetrics(font)
        size = font.pointSize()
        while size > 4 and fm.width(text) > widget.width():
            size -= 1
            font.setPointSize(size)
            fm = QFontMetrics(font)
        widget.setFont(font)

    def populateData(self, data):
        for detail, value in data.items():
            if detail in self.detail_inputs:
                self.detail_inputs[detail].setText(value)
                if detail in ["ชื่อวัตถุดิบ", "ชื่อผู้ส่ง"]:
                    self.fit_font_to_widget(self.detail_inputs[detail], value)



                
    def clear_data(self):
        self.data_edit.clear()
        for detail_input in self.detail_inputs.values():
            detail_input.clear()
        self.qr_label.setPixmap(QPixmap())  # Clear the QR code
        self.right_qr_label.setPixmap(QPixmap()) 
        self.qc1_label.hide()
        self.qc2_label.hide() # Clear the additional QR code
        


    def generate_qrcode(self, data):
        code = data.get('CODE', '')
       
        qr_data = f"{data.get('ลำดับคิว', '')},{data.get('วันที่', '')},{data.get('Inspection Lot', '')}," \
                    f"{data.get('Batch', '')},{data.get('โรงงาน', '')},{code},{data.get('CODE ผู้ส่ง', '')},0010"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=2,
            border=1,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    

        # แปลงกลับเป็น QPixmap
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        pixmap = QPixmap()    
        pixmap.loadFromData(buffer.getvalue())
        self.qr_label.setPixmap(pixmap)
        self.qr_label.setFixedSize(pixmap.size())
        self.qc1_label.show()
          
       
    def generate_additional_qrcode(self, data):
        
        code = data.get('CODE', '')
        qr_data = f"{data.get('ลำดับคิว', '')},{data.get('วันที่', '')},{data.get('Inspection Lot', '')}," \
                    f"{data.get('Batch', '')},{data.get('โรงงาน', '')},{code},{data.get('CODE ผู้ส่ง', '')},0020"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=2,
            border=1,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
       
        # Convert to QPixmap
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        pixmap = QPixmap()
        pixmap.loadFromData(buffer.getvalue())
        self.right_qr_label.setPixmap(pixmap)
        self.right_qr_label.setFixedSize(pixmap.size())
        self.qc2_label.show()
    

        
        
 
    def initUI(self):
        self.setWindowTitle(self.title)
        layout = QHBoxLayout()
        qr_layout = QVBoxLayout()
        


        # Left side frame
        left_frame = QFrame()
        left_layout = QVBoxLayout(left_frame)

        # Add a sign name label and input at the top of the left layout
        lbl_sign_name = QLabel("ลงชื่อ:")
        self.sign_name_input = QLineEdit()
        left_layout.addWidget(lbl_sign_name)
        left_layout.addWidget(self.sign_name_input)
        
        self.data_edit = QTextEdit()
        left_layout.addWidget(self.data_edit)
        
        generate_btn = QPushButton('Generate')
        generate_btn.clicked.connect(self.generate_data)
        clear_btn = QPushButton('Clear')
        clear_btn.clicked.connect(self.clear_data)

        button_layout = QHBoxLayout()
        button_layout.addWidget(generate_btn)
        button_layout.addWidget(clear_btn)
        
        app_info_label = QLabel("Agro Business | QAQS | Smart Quality | Dev by QI - 2023 | V.1.1.2_PD")
        app_info_label.setAlignment(Qt.AlignCenter)  # Center align the text

        # You can set the font and size of the QLabel text like this:
        app_info_label.setFont(QFont("Arial", 5))  # Adjust the font and size as needed

        # Now, add the QLabel to the left_layout below the buttons
        left_layout.addLayout(button_layout)
        left_layout.addWidget(app_info_label)  # Add the app information label to the layout
        layout.addWidget(left_frame)

        #Right side form
        self.outerFrame = QFrame()
        self.outerFrame.setFrameShape(QFrame.Box)
        self.outerFrame.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding) 
        
        outerLayout = QGridLayout(self.outerFrame)

        detailsFrame = QFrame()
        detailsFrame.setFrameShape(QFrame.Box)
        detailsLayout = QGridLayout(detailsFrame)
        detailsLayout.setVerticalSpacing(5) 
         # กำหนด QSizePolicy ให้กับ detailsFrame
        detailsFrame.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        # Add the QR code and text labels here
        self.qr_label = QLabel()
        detailsLayout.addWidget(self.qr_label, 1, 1)
        detailsLayout.addWidget(self.qc1_label, 1, 0)
        
    
        self.right_qr_label = QLabel()
        detailsLayout.addWidget(self.right_qr_label, 1, 5)
        detailsLayout.addWidget(self.qc2_label, 1, 4)
        
            

        # Add headers to the details frame
        leftHeader = QLabel("โรงงานอาหารสัตว์เครือเบทาโกร")
        leftHeader.setFont(QFont("Arial", 6))
        detailsLayout.addWidget(leftHeader, 0, 0)

        rightHeader = QLabel("FM-FB-QA-01-01-09:01/12/66 Rev.5")
        rightHeader.setAlignment(Qt.AlignRight)
        rightHeader.setFont(QFont("Arial", 6))
        detailsLayout.addWidget(rightHeader, 0, 5)

      
        # Add title to the details frame
        titleLabel = QLabel("ใบบันทึกการตรวจรับ")
        titleLabel.setAlignment(Qt.AlignCenter)
        titleLabel.setFont(QFont("Arial", 14, QFont.Bold))
        detailsLayout.addWidget(titleLabel, 1, 0, 1, 6)  # Spanning across 6 columns for center alignment

        details = ["โรงงาน", "วันที่", "ลำดับคิว", "Inspection Lot", "Batch", "เลขที่รับ"]
        rows, cols = 2, 3
        for idx, detail in enumerate(details):
            r, c = divmod(idx, cols)
            lbl = QLabel(detail)
            lbl.setFrameStyle(QFrame.StyledPanel | QFrame.Sunken)
            detailsLayout.addWidget(lbl, r+2, c*2)  # Add 2 to the row index to make space for the title and headers
            line_edit = QLineEdit()
            if detail in ["โรงงาน", "วันที่", "ลำดับคิว", "Inspection Lot", "Batch", "เลขที่รับ"]:
                line_edit.setMinimumWidth(100)
            
            self.detail_inputs[detail] = line_edit  # Store the reference of the QLineEdit
            detailsLayout.addWidget(line_edit, r+2, c*2 + 1)

        outerLayout.addWidget(detailsFrame, 0, 0, 1, 4)

        # Title for colFrame1
        title1 = QLabel("ตรวจสอบรอบแรก")
        title1.setFont(QFont("Arial", 7, QFont.Bold))
        title1.setAlignment(Qt.AlignCenter)
        outerLayout.addWidget(title1, 1, 0, 1, 2)  # Span across first 2 columns

        # Title for colFrame2
        title2 = QLabel("ตรวจสอบรอบสอง")
        title2.setFont(QFont("Arial", 7, QFont.Bold))
        title2.setAlignment(Qt.AlignCenter)
        outerLayout.addWidget(title2, 1, 2, 1, 2)  # Span across next 2 columns

        colFrame1 = QFrame()
        colFrame1.setFrameShape(QFrame.Box)
        colLayout1 = QGridLayout(colFrame1)

        # กำหนด QSizePolicy ให้กับ colFrame1
        colFrame1.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        column1 = ["ทะเบียนรถ(หัว)", "ทะเบียนรถ(ท้าย)", "ชื่อวัตถุดิบ", "CODE", "ชื่อผู้ส่ง", "CODE ผู้ส่ง", "ความชื้นข้าวโพด         ","หมายเหตุ", "Q-Score", "Sampling", "ลงชื่อ"]
        for i, field in enumerate(column1):
            lbl = QLabel(field)
            lbl.setFrameStyle(QFrame.StyledPanel | QFrame.Sunken)
            colLayout1.addWidget(lbl, i, 0)
            
            if field == "หมายเหตุ":
                le = QTextEdit()
                le.setMaximumHeight(50)  # Adjust this value to control the height of the multi-line input.
            else:
                le = QLineEdit()
            colLayout1.addWidget(le, i, 1)
            self.detail_inputs[field] = le

        outerLayout.addWidget(colFrame1, 2, 0, 1, 2)

        colFrame2 = QFrame()
        colFrame2.setFrameShape(QFrame.Box)
        colLayout2 = QGridLayout(colFrame2)

        colFrame2.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        column2_textfields = ["จำนวนที่รับจริง   ", "จำนวนที่ส่งคืน   ", "ตำแหน่ง", "จำนวนพาเลท", "น้ำหนักพาเลท"]
        for i, field in enumerate(column2_textfields):
            lbl = QLabel(field)
            lbl.setFrameStyle(QFrame.StyledPanel | QFrame.Sunken)
            colLayout2.addWidget(lbl, i, 0)
            colLayout2.addWidget(QLineEdit(), i, 1)

        


        column2_checkboxes = ["รถโฟร์คลิฟท์ตักลง", "พนง.เบทาโกรลงของ", "พนง.ขับรถลงของ"]
        for i, chk in enumerate(column2_checkboxes):
            colLayout2.addWidget(QCheckBox(chk), i + 5, 0, 1, 2)

        colLayout2.addWidget(QLabel("หมายเหตุ"), 8, 0)
        le = QTextEdit()
        le.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)  # ปิดการใช้งาน vertical scroll bar
        le.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)  # ปิดการใช้งาน horizontal scroll bar
        le.setFixedHeight(le.fontMetrics().lineSpacing() + 40 ) # กำหนดความสูงของ QTextEdit ให้ตรงกับความสูงของบรรทัด
        colLayout2.addWidget(le, 8, 1)
    
        


        colLayout2.addWidget(QLabel("ลงชื่อ (QC)"), 9, 0)
        colLayout2.addWidget(QLineEdit(), 9, 1)

        # New code for "ลงชื่อ2"
        colLayout2.addWidget(QLabel("ลงชื่อ (WH)"), 10, 0)  # Add the label for the new signature line
        signatureLineEdit2 = QLineEdit()
        colLayout2.addWidget(signatureLineEdit2, 10, 1) # Add the line edit for the new signature line

        # Adjust the spacer to move to the next row, after the newly added "ลงชื่อ2"
        colLayout2.addItem(QSpacerItem(20, 40, QSizePolicy.Minimum, QSizePolicy.Expanding), 11, 0, 1, 2)

        outerLayout.addWidget(colFrame2, 2, 2, 1, 2)

        layout.addWidget(self.outerFrame)

        # Move the print button below the outer frame
        print_button = QPushButton('Print_form')
        print_button.clicked.connect(self.print_form)
        layout.addWidget(print_button)

        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)
        self.show()

# Enable High DPI scaling
# Enable High DPI scaling
QApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setAttribute(Qt.HighDpiScaleFactorRoundingPolicy.PassThrough)
    ex = App()
    sys.exit(app.exec_())