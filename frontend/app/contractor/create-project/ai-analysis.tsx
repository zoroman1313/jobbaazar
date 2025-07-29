"use client";
import { useState, useRef, useEffect } from "react";
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaRuler,
  FaHome,
  FaBath,
  FaBed,
  FaUtensils,
  FaCouch,
  FaDoorOpen,
  FaLevelUpAlt,
  FaCar,
  FaInfoCircle,
  FaPlus
} from "react-icons/fa";

interface DetectedRoom {
  id: string;
  room: string;
  area: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AIAnalysisProps {
  file: File;
  onAnalysisComplete: (rooms: DetectedRoom[]) => void;
  onCancel: () => void;
}

const roomIcons: { [key: string]: any } = {
  bedroom: FaBed,
  kitchen: FaUtensils,
  bathroom: FaBath,
  living: FaCouch,
  dining: FaUtensils,
  hallway: FaDoorOpen,
  stairs: FaLevelUpAlt,
  garage: FaCar,
  default: FaHome
};

export default function AIAnalysis({ file, onAnalysisComplete, onCancel }: AIAnalysisProps) {
  const [analysisStep, setAnalysisStep] = useState<'uploading' | 'processing' | 'detecting' | 'validating' | 'complete'>('uploading');
  const [detectedRooms, setDetectedRooms] = useState<DetectedRoom[]>([]);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Persian translations
  const translations = {
    analyzingFloorPlan: "در حال تحلیل نقشه کف...",
    step1: "مرحله ۱: آپلود و آماده‌سازی تصویر",
    step2: "مرحله ۲: تشخیص متن و اعداد (OCR)",
    step3: "مرحله ۳: تشخیص شکل اتاق‌ها",
    step4: "مرحله ۴: تحلیل هوشمند با GPT-4",
    step5: "مرحله ۵: آماده‌سازی نتایج",
    processing: "در حال پردازش...",
    detectedRooms: "اتاق‌های تشخیص داده شده",
    roomName: "نام اتاق",
    area: "مساحت",
    confidence: "دقت",
    editRoom: "ویرایش اتاق",
    deleteRoom: "حذف اتاق",
    confirmAll: "تایید همه",
    editAdjust: "ویرایش / تنظیم",
    addRoom: "افزودن اتاق",
    saveChanges: "ذخیره تغییرات",
    cancel: "لغو",
    checkDetected: "اتاق‌های تشخیص داده شده را بررسی کنید. آیا درست هستند؟",
    validationBanner: "بررسی فضاها و مساحت‌های تشخیص داده شده. آیا این‌ها صحیح هستند؟",
    processingComplete: "پردازش کامل شد!",
    errorOccurred: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    noRoomsDetected: "هیچ اتاقی تشخیص داده نشد. لطفاً نقشه را بررسی کنید.",
    manualEntry: "ورود دستی",
    autoDetected: "تشخیص خودکار",
    highConfidence: "دقت بالا",
    mediumConfidence: "دقت متوسط",
    lowConfidence: "دقت پایین"
  };

  useEffect(() => {
    if (file) {
      startAnalysis();
    }
  }, [file]);

  const startAnalysis = async () => {
    try {
      // Step 1: Upload and prepare image
      setAnalysisStep('uploading');
      setProcessingProgress(10);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setTimeout(() => {
          setAnalysisStep('processing');
          setProcessingProgress(20);
          processImage();
        }, 1000);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error starting analysis:', error);
      alert(translations.errorOccurred);
    }
  };

  const processImage = async () => {
    try {
      // Step 2: OCR Processing (simulated)
      setAnalysisStep('detecting');
      setProcessingProgress(40);
      
      await simulateOCR();
      
      // Step 3: Object Detection (simulated)
      setProcessingProgress(60);
      await simulateObjectDetection();
      
      // Step 4: GPT-4 Vision Analysis (simulated)
      setProcessingProgress(80);
      await simulateGPT4Analysis();
      
      // Step 5: Finalize results
      setAnalysisStep('validating');
      setProcessingProgress(100);
      
      // Simulate detected rooms based on common floor plan patterns
      const mockDetectedRooms: DetectedRoom[] = [
        {
          id: '1',
          room: 'اتاق خواب',
          area: '12.5 m²',
          confidence: 0.92,
          x: 50,
          y: 30,
          width: 120,
          height: 100
        },
        {
          id: '2',
          room: 'آشپزخانه',
          area: '9.8 m²',
          confidence: 0.87,
          x: 200,
          y: 30,
          width: 100,
          height: 80
        },
        {
          id: '3',
          room: 'حمام',
          area: '6.2 m²',
          confidence: 0.95,
          x: 320,
          y: 30,
          width: 60,
          height: 80
        },
        {
          id: '4',
          room: 'اتاق نشیمن',
          area: '18.3 m²',
          confidence: 0.89,
          x: 50,
          y: 150,
          width: 150,
          height: 120
        },
        {
          id: '5',
          room: 'راهرو',
          area: '4.5 m²',
          confidence: 0.78,
          x: 200,
          y: 150,
          width: 80,
          height: 40
        }
      ];

      setDetectedRooms(mockDetectedRooms);
      setAnalysisStep('complete');
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert(translations.errorOccurred);
    }
  };

  const simulateOCR = () => new Promise(resolve => setTimeout(resolve, 2000));
  const simulateObjectDetection = () => new Promise(resolve => setTimeout(resolve, 1500));
  const simulateGPT4Analysis = () => new Promise(resolve => setTimeout(resolve, 2500));

  const handleRoomEdit = (roomId: string) => {
    setEditingRoom(roomId);
  };

  const handleRoomDelete = (roomId: string) => {
    setDetectedRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleRoomUpdate = (roomId: string, field: keyof DetectedRoom, value: string | number) => {
    setDetectedRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, [field]: value }
          : room
      )
    );
  };

  const handleConfirmAll = () => {
    onAnalysisComplete(detectedRooms);
  };

  const handleAddManualRoom = () => {
    const newRoom: DetectedRoom = {
      id: `manual-${Date.now()}`,
      room: 'اتاق جدید',
      area: '0 m²',
      confidence: 1.0,
      x: 50,
      y: 50,
      width: 80,
      height: 60
    };
    setDetectedRooms(prev => [...prev, newRoom]);
    setEditingRoom(newRoom.id);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return translations.highConfidence;
    if (confidence >= 0.7) return translations.mediumConfidence;
    return translations.lowConfidence;
  };

  const getRoomIcon = (roomName: string) => {
    const lowerName = roomName.toLowerCase();
    for (const [key, icon] of Object.entries(roomIcons)) {
      if (lowerName.includes(key)) return icon;
    }
    return roomIcons.default;
  };

  if (analysisStep === 'uploading' || analysisStep === 'processing' || analysisStep === 'detecting') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {translations.analyzingFloorPlan}
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className={`flex items-center space-x-3 space-x-reverse ${analysisStep === 'uploading' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${analysisStep === 'uploading' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {analysisStep === 'uploading' ? <FaCheck className="w-3 h-3" /> : '1'}
              </div>
              <span className="text-sm">{translations.step1}</span>
            </div>
            
            <div className={`flex items-center space-x-3 space-x-reverse ${analysisStep === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${analysisStep === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {analysisStep === 'processing' ? <FaSpinner className="w-3 h-3 animate-spin" /> : '2'}
              </div>
              <span className="text-sm">{translations.step2}</span>
            </div>
            
            <div className={`flex items-center space-x-3 space-x-reverse ${analysisStep === 'detecting' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${analysisStep === 'detecting' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {analysisStep === 'detecting' ? <FaSpinner className="w-3 h-3 animate-spin" /> : '3'}
              </div>
              <span className="text-sm">{translations.step3}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            {processingProgress}% {translations.processing}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              تحلیل هوشمند نقشه کف
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Validation Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  {translations.validationBanner}
                </h3>
                <p className="text-sm text-blue-700">
                  لطفاً اتاق‌های تشخیص داده شده را بررسی کرده و در صورت نیاز ویرایش کنید
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview with Overlay */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                پیش‌نمایش نقشه
              </h3>
              
              <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Floor Plan"
                  className="w-full h-auto"
                  onLoad={() => {
                    // Draw room overlays when image loads
                    if (canvasRef.current && imageRef.current) {
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext('2d');
                      const img = imageRef.current;
                      
                      canvas.width = img.naturalWidth;
                      canvas.height = img.naturalHeight;
                      
                      if (ctx) {
                        detectedRooms.forEach(room => {
                          ctx.strokeStyle = '#3B82F6';
                          ctx.lineWidth = 2;
                          ctx.strokeRect(room.x, room.y, room.width, room.height);
                          
                          ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
                          ctx.fillRect(room.x, room.y, room.width, room.height);
                          
                          ctx.fillStyle = '#1F2937';
                          ctx.font = '12px Arial';
                          ctx.fillText(room.room, room.x + 5, room.y + 15);
                          ctx.fillText(room.area, room.x + 5, room.y + 30);
                        });
                      }
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
              </div>
            </div>

            {/* Detected Rooms List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {translations.detectedRooms} ({detectedRooms.length})
                </h3>
                <button
                  onClick={handleAddManualRoom}
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>{translations.addRoom}</span>
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {detectedRooms.map(room => {
                  const IconComponent = getRoomIcon(room.room);
                  const isEditing = editingRoom === room.id;
                  
                  return (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {translations.roomName}
                            </label>
                            <input
                              type="text"
                              value={room.room}
                              onChange={(e) => handleRoomUpdate(room.id, 'room', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {translations.area}
                            </label>
                            <input
                              type="text"
                              value={room.area}
                              onChange={(e) => handleRoomUpdate(room.id, 'area', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => setEditingRoom(null)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              {translations.saveChanges}
                            </button>
                            <button
                              onClick={() => setEditingRoom(null)}
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                              {translations.cancel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {room.room}
                              </div>
                              <div className="text-sm text-gray-600">
                                {room.area}
                              </div>
                              <div className={`text-xs ${getConfidenceColor(room.confidence)}`}>
                                {getConfidenceText(room.confidence)} ({Math.round(room.confidence * 100)}%)
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleRoomEdit(room.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRoomDelete(room.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {detectedRooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{translations.noRoomsDetected}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 space-x-reverse mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleConfirmAll}
              disabled={detectedRooms.length === 0}
              className="flex-1 flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaCheck className="w-4 h-4" />
              <span>{translations.confirmAll}</span>
            </button>
            
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              <span>{translations.cancel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 