"use client";
import { useState, useEffect, useRef } from "react";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaUpload, 
  FaSave, 
  FaTimes,
  FaHome,
  FaBath,
  FaBed,
  FaUtensils,
  FaCouch,
  FaDoorOpen,
  FaLevelUpAlt,
  FaCar,
  FaMap,
  FaLocationArrow,
  FaInfoCircle,
  FaCheck,
  FaBrain,
  FaEye
} from "react-icons/fa";
import AIAnalysis from "./ai-analysis";

// Persian translations
const translations = {
  back: "بازگشت",
  createProject: "ایجاد پروژه جدید",
  roomSelection: "انتخاب اتاق",
  addRoom: "افزودن اتاق",
  addNewRoom: "افزودن اتاق جدید",
  roomName: "نام اتاق",
  roomSize: "اندازه (متر مربع)",
  removeRoom: "حذف",
  projectLocation: "موقعیت پروژه",
  postcode: "کد پستی",
  postcodePlaceholder: "کد پستی را وارد کنید",
  useMyLocation: "📍 استفاده از موقعیت من",
  mapUpload: "آپلود نقشه کف",
  uploadFile: "آپلود فایل",
  dragDrop: "فایل‌ها را اینجا بکشید یا کلیک کنید",
  supportedFormats: "فرمت‌های پشتیبانی شده: JPG، PDF",
  maxFileSize: "حداکثر اندازه فایل: 10 مگابایت",
  projectTitle: "عنوان پروژه",
  projectDescription: "توضیحات پروژه",
  budget: "بودجه (£)",
  timeline: "زمان‌بندی (هفته)",
  submit: "ایجاد پروژه",
  cancel: "لغو",
  projectCreated: "پروژه با موفقیت ایجاد شد!",
  enterRoomName: "نام اتاق را وارد کنید",
  saveRoom: "ذخیره اتاق",
  cancelRoom: "لغو",
  kitchen: "آشپزخانه",
  bathroom: "حمام",
  bedroom: "اتاق خواب",
  livingRoom: "اتاق نشیمن",
  diningRoom: "اتاق غذاخوری",
  hallway: "راهرو",
  stairs: "پله‌ها",
  garage: "گاراژ",
  other: "سایر",
  required: "ضروری",
  optional: "اختیاری",
  loading: "در حال بارگذاری...",
  locationError: "خطا در دریافت موقعیت",
  noLocation: "موقعیت یافت نشد",
  address: "آدرس",
  selectPostcode: "کد پستی را انتخاب کنید",
  searching: "در حال جستجو...",
  noResults: "نتیجه‌ای یافت نشد",
};

// Predefined rooms with icons
const predefinedRooms = [
  { id: "kitchen", name: "آشپزخانه", icon: FaUtensils },
  { id: "bathroom", name: "حمام", icon: FaBath },
  { id: "bedroom", name: "اتاق خواب", icon: FaBed },
  { id: "livingRoom", name: "اتاق نشیمن", icon: FaCouch },
  { id: "diningRoom", name: "اتاق غذاخوری", icon: FaUtensils },
  { id: "hallway", name: "راهرو", icon: FaDoorOpen },
  { id: "stairs", name: "پله‌ها", icon: FaLevelUpAlt },
  { id: "garage", name: "گاراژ", icon: FaCar },
  { id: "other", name: "سایر", icon: FaHome },
];

interface Room {
  id: string;
  name: string;
  count: number;
  instances: Array<{
    id: string;
    length?: string;
    width?: string;
    height?: string;
    area?: string;
  }>;
  isCustom?: boolean;
}

interface PostcodeSuggestion {
  postcode: string;
  district: string;
  admin_district: string;
  admin_ward: string;
  parish: string;
  admin_county: string;
  admin_county_code: string;
  country: string;
  latitude: string;
  longitude: string;
}

export default function ContractorCreateProjectPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "",
    postcode: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<PostcodeSuggestion[]>([]);
  const [showPostcodeSuggestions, setShowPostcodeSuggestions] = useState(false);
  const [isLoadingPostcodes, setIsLoadingPostcodes] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapKey, setMapKey] = useState(0); // For map re-rendering
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysisFile, setAiAnalysisFile] = useState<File | null>(null);
  const [aiDetectedRooms, setAiDetectedRooms] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const postcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fix hydration issue by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePostcodeChange = async (value: string) => {
    handleInputChange("postcode", value);
    
    // Clear previous timeout
    if (postcodeTimeoutRef.current) {
      clearTimeout(postcodeTimeoutRef.current);
    }

    // If it's a partial postcode (3-4 characters) or complete postcode (5-8 characters), try to get its details
    if (value.length >= 3 && value.length <= 8) {
      postcodeTimeoutRef.current = setTimeout(async () => {
        try {
          console.log("Looking up postcode:", value);
          
          // First try to get the specific postcode details
          const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(value)}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("Postcode lookup response:", data);
            
            if (data.result) {
              const postcode = data.result;
              const addressText = postcode.admin_district || postcode.admin_county || value;
              setFormData(prev => ({
                ...prev,
                postcode: value,
                address: addressText,
                latitude: postcode.latitude.toString(),
                longitude: postcode.longitude.toString()
              }));
              setMapKey(prev => prev + 1);
              console.log("Updated map with coordinates:", postcode.latitude, postcode.longitude);
              return;
            }
          }
          
          // If specific postcode not found, try to get area information from search
          const searchResponse = await fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(value)}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.result && searchData.result.length > 0) {
              const firstResult = searchData.result[0];
              const addressText = firstResult.admin_district || firstResult.admin_county || value;
              setFormData(prev => ({
                ...prev,
                postcode: value,
                address: addressText,
                latitude: firstResult.latitude.toString(),
                longitude: firstResult.longitude.toString()
              }));
              setMapKey(prev => prev + 1);
              console.log("Updated map with area coordinates:", firstResult.latitude, firstResult.longitude);
            }
          }
        } catch (error) {
          console.error("Error looking up postcode:", error);
        }
      }, 1000); // Wait 1 second after user stops typing
    }

    if (value.length >= 3) {
      // Debounce API calls for suggestions
      postcodeTimeoutRef.current = setTimeout(async () => {
        setIsLoadingPostcodes(true);
        try {
          console.log("Fetching postcodes for:", value);
          const response = await fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(value)}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Postcode API response:", data);
          
          if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            setPostcodeSuggestions(data.result);
            setShowPostcodeSuggestions(true);
            console.log("Found postcodes:", data.result.length);
          } else {
            console.log("No postcodes found");
            setPostcodeSuggestions([]);
            setShowPostcodeSuggestions(false);
          }
        } catch (error) {
          console.error("Error fetching postcodes:", error);
          
          // Fallback: Use a simpler approach with predefined postcodes
          console.log("Using fallback postcode suggestions");
          const fallbackSuggestions: PostcodeSuggestion[] = [
            { 
              postcode: "NW1", 
              district: "Camden", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5320",
              longitude: "-0.1233"
            },
            { 
              postcode: "E1", 
              district: "Tower Hamlets", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5200",
              longitude: "-0.0700"
            },
            { 
              postcode: "SW1", 
              district: "Westminster", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5000",
              longitude: "-0.1300"
            },
            { 
              postcode: "W1", 
              district: "Westminster", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5200",
              longitude: "-0.1500"
            },
            { 
              postcode: "N1", 
              district: "Islington", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5400",
              longitude: "-0.1000"
            },
            { 
              postcode: "SE1", 
              district: "Southwark", 
              admin_district: "London",
              admin_ward: "",
              parish: "",
              admin_county: "Greater London",
              admin_county_code: "",
              country: "England",
              latitude: "51.5000",
              longitude: "-0.0900"
            },
          ].filter(p => p.postcode.toLowerCase().includes(value.toLowerCase()));
          
          if (fallbackSuggestions.length > 0) {
            setPostcodeSuggestions(fallbackSuggestions);
            setShowPostcodeSuggestions(true);
          } else {
            setPostcodeSuggestions([]);
            setShowPostcodeSuggestions(false);
          }
        } finally {
          setIsLoadingPostcodes(false);
        }
      }, 300);
    } else {
      setShowPostcodeSuggestions(false);
    }
  };

  const handlePostcodeSelect = (suggestion: PostcodeSuggestion) => {
    console.log("Selected postcode:", suggestion);
    
    // Update form data immediately
    setFormData(prev => ({
      ...prev,
      postcode: suggestion.postcode,
      address: `${suggestion.district}, ${suggestion.admin_district}`,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    }));
    
    setShowPostcodeSuggestions(false);
    setMapKey(prev => prev + 1); // Re-render map
    
    console.log("Map key updated to:", mapKey + 1);
    console.log("New coordinates:", suggestion.latitude, suggestion.longitude);
  };

  const handleConfirmPartialPostcode = async () => {
    if (formData.postcode.length < 3) {
      console.log("Postcode too short:", formData.postcode);
      return;
    }
    
    try {
      console.log("Confirming partial postcode:", formData.postcode);
      
      // Search for the partial postcode to get area information
      const response = await fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(formData.postcode)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log("API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Partial postcode search response:", data);
        
        if (data.result && data.result.length > 0) {
          const firstResult = data.result[0];
          const addressText = firstResult.admin_district || firstResult.admin_county || formData.postcode;
          
          console.log("Setting form data with:", {
            address: addressText,
            latitude: firstResult.latitude,
            longitude: firstResult.longitude
          });
          
          setFormData(prev => ({
            ...prev,
            address: addressText,
            latitude: firstResult.latitude.toString(),
            longitude: firstResult.longitude.toString()
          }));
          
          setShowPostcodeSuggestions(false);
          setMapKey(prev => prev + 1);
          
          console.log("Confirmed partial postcode with coordinates:", firstResult.latitude, firstResult.longitude);
          
          // Show success message
          alert(`منطقه انتخاب شد: ${addressText}`);
        } else {
          console.log("No results found for postcode");
          alert("برای این کد پستی منطقه‌ای یافت نشد");
        }
      } else {
        console.log("API request failed:", response.status);
        alert("خطا در دریافت اطلاعات کد پستی");
      }
    } catch (error) {
      console.error("Error confirming partial postcode:", error);
      alert("خطا در تایید کد پستی");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("مرورگر شما از موقعیت جغرافیایی پشتیبانی نمی‌کند");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data.address) {
            const postcode = data.address.postcode || "";
            handleInputChange("postcode", postcode);
            
            // Create a cleaner address from Nominatim data
            const addressParts = [];
            if (data.address.road) addressParts.push(data.address.road);
            if (data.address.city) addressParts.push(data.address.city);
            else if (data.address.town) addressParts.push(data.address.town);
            else if (data.address.village) addressParts.push(data.address.village);
            if (data.address.county) addressParts.push(data.address.county);
            
            const cleanAddress = addressParts.length > 0 ? addressParts.join(", ") : data.display_name;
            handleInputChange("address", cleanAddress);
            handleInputChange("latitude", latitude.toString());
            handleInputChange("longitude", longitude.toString());
            setMapKey(prev => prev + 1);
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          alert(translations.locationError);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(translations.locationError);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleAddRoom = (roomType: string) => {
    setSelectedRooms(prev => {
      const existingRoom = prev.find(r => r.id === roomType);
      
      if (existingRoom) {
        // Increment count and add new instance
        return prev.map(room => 
          room.id === roomType 
            ? {
                ...room,
                count: room.count + 1,
                instances: [...room.instances, { id: `${roomType}-${Date.now()}` }]
              }
            : room
        );
      } else {
        // Add new room
        const room = predefinedRooms.find(r => r.id === roomType);
        if (room) {
          return [...prev, {
            id: roomType,
            name: room.name,
            count: 1,
            instances: [{ id: `${roomType}-${Date.now()}` }]
          }];
        }
      }
      return prev;
    });
  };

  const handleRemoveRoomInstance = (roomId: string, instanceId: string) => {
    setSelectedRooms(prev => {
      const updatedRooms = prev.map(room => {
        if (room.id === roomId) {
          const newInstances = room.instances.filter(inst => inst.id !== instanceId);
          if (newInstances.length === 0) {
            return null; // Remove room entirely
          }
          return {
            ...room,
            count: newInstances.length,
            instances: newInstances
          };
        }
        return room;
      }).filter(Boolean) as Room[];
      
      return updatedRooms;
    });
  };

  const handleRoomDimensionChange = (roomId: string, instanceId: string, dimension: 'length' | 'width' | 'height', value: string) => {
    setSelectedRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? {
              ...room,
              instances: room.instances.map(instance => {
                if (instance.id === instanceId) {
                  const updatedInstance = { ...instance, [dimension]: value };
                  
                  // Calculate area if both length and width are available
                  if (updatedInstance.length && updatedInstance.width) {
                    const length = parseFloat(updatedInstance.length);
                    const width = parseFloat(updatedInstance.width);
                    if (!isNaN(length) && !isNaN(width)) {
                      updatedInstance.area = (length * width).toFixed(2);
                    }
                  }
                  
                  return updatedInstance;
                }
                return instance;
              })
            }
          : room
      )
    );
  };

  const handleAddCustomRoom = () => {
    if (newRoomName.trim()) {
      const customRoom: Room = {
        id: `custom-${Date.now()}`,
        name: newRoomName.trim(),
        count: 1,
        instances: [{ id: `custom-${Date.now()}-${Date.now()}` }],
        isCustom: true,
      };
      setSelectedRooms(prev => [...prev, customRoom]);
      setCustomRooms(prev => [...prev, newRoomName.trim()]);
      setNewRoomName("");
      setShowRoomModal(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png" ||
        file.type === "application/pdf"
      );
      setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleAIAnalysis = (file: File) => {
    setAiAnalysisFile(file);
    setShowAIAnalysis(true);
    setIsAnalyzing(true);
  };

  const handleAIAnalysisComplete = (detectedRooms: any[]) => {
    setAiDetectedRooms(detectedRooms);
    setShowAIAnalysis(false);
    setIsAnalyzing(false);
    
    // Auto-fill the room selection with detected rooms
    const newRooms: Room[] = detectedRooms.map((room, index) => ({
      id: `ai-detected-${index}`,
      name: room.room,
      count: 1,
      instances: [{
        id: `ai-detected-${index}-${Date.now()}`,
        area: room.area.replace(' m²', '')
      }],
      isCustom: true
    }));
    
    setSelectedRooms(prev => [...prev, ...newRooms]);
    
    // Add the analyzed file to uploaded files if not already there
    if (aiAnalysisFile && !uploadedFiles.find(f => f.name === aiAnalysisFile.name)) {
      setUploadedFiles(prev => [...prev, aiAnalysisFile]);
    }
    
    alert(`تعداد ${detectedRooms.length} اتاق با موفقیت تشخیص داده شد و به لیست اضافه شد!`);
  };

  const handleAIAnalysisCancel = () => {
    setShowAIAnalysis(false);
    setIsAnalyzing(false);
    setAiAnalysisFile(null);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || selectedRooms.length === 0) {
      alert("لطفاً تمام فیلدهای ضروری را پر کنید و حداقل یک اتاق اضافه کنید");
      setIsSubmitting(false);
      return;
    }

    // TODO: Implement actual submission logic
    console.log("Submitting project:", { 
      ...formData, 
      rooms: selectedRooms, 
      files: uploadedFiles 
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert(translations.projectCreated);
      // Reset form
      setFormData({
        title: "",
        description: "",
        budget: "",
        timeline: "",
        postcode: "",
        address: "",
        latitude: "",
        longitude: "",
      });
      setSelectedRooms([]);
      setUploadedFiles([]);
    }, 2000);
  };

  const getRoomIcon = (roomId: string) => {
    const room = predefinedRooms.find(r => r.id === roomId);
    return room ? room.icon : FaHome;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {translations.createProject}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Project Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  اطلاعات پروژه
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.projectTitle} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.budget} ({translations.optional})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.projectDescription} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="توضیحات پروژه را وارد کنید..."
                    required
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.timeline} ({translations.optional})
                  </label>
                  <input
                    type="number"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange("timeline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4"
                  />
                </div>
              </div>

              {/* Room Selection */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.roomSelection} *
                </h2>
                
                {/* Predefined Room Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                  {predefinedRooms.map(room => {
                    const IconComponent = room.icon;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => handleAddRoom(room.id)}
                        className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <IconComponent className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700 text-center">
                          {room.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Room Button */}
                <button
                  type="button"
                  onClick={() => setShowRoomModal(true)}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 border-2 border-dashed border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>{translations.addNewRoom}</span>
                </button>

                {/* Selected Rooms Display */}
                {selectedRooms.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-md font-medium text-gray-900">
                      اتاق‌های انتخاب شده ({selectedRooms.reduce((sum, room) => sum + room.count, 0)})
                    </h3>
                    
                    {selectedRooms.map(room => {
                      const IconComponent = room.isCustom ? FaHome : getRoomIcon(room.id);
                      return (
                        <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 space-x-reverse mb-3">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {room.name} ({room.count})
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {room.instances.map((instance, index) => (
                              <div key={instance.id} className="space-y-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                  <span className="text-sm font-medium text-gray-700 w-8">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm text-gray-600">ابعاد اتاق:</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">طول (متر)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={instance.length || ""}
                                      onChange={(e) => handleRoomDimensionChange(room.id, instance.id, 'length', e.target.value)}
                                      placeholder="طول"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">عرض (متر)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={instance.width || ""}
                                      onChange={(e) => handleRoomDimensionChange(room.id, instance.id, 'width', e.target.value)}
                                      placeholder="عرض"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">ارتفاع (متر)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={instance.height || ""}
                                      onChange={(e) => handleRoomDimensionChange(room.id, instance.id, 'height', e.target.value)}
                                      placeholder="ارتفاع"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">مساحت (متر مربع)</label>
                                    <input
                                      type="text"
                                      value={instance.area || ""}
                                      placeholder="محاسبه خودکار"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-black text-sm"
                                      readOnly
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRoomInstance(room.id, instance.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Project Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.projectLocation}
                </h2>
                
                <div className="space-y-4">
                  {/* Postcode Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.postcode}
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <div className="relative w-48">
                        <input
                          type="text"
                          value={formData.postcode}
                          onChange={(e) => handlePostcodeChange(e.target.value)}
                          maxLength={8}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder={translations.postcodePlaceholder}
                        />
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      
                      {/* کافی است Button - Inline */}
                      {formData.postcode.length >= 3 && (
                        <button
                          type="button"
                          onClick={() => handleConfirmPartialPostcode()}
                          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                        >
                          <FaCheck className="w-4 h-4" />
                          <span>کافی است</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Help Text */}
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-start space-x-2 space-x-reverse">
                        <FaInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700 mb-1">راهنمای کد پستی:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• حداقل ۳ حرف وارد کنید تا پیشنهادات نمایش داده شود</li>
                            <li>• می‌توانید کد پستی کامل (مثل CM2 9JW) یا جزئی (مثل CM2) وارد کنید</li>
                            <li>• در صورت وارد کردن کد پستی جزئی، منطقه مربوطه نمایش داده می‌شود</li>
                            <li>• نقشه موقعیت مرکزی منطقه انتخاب شده را نشان می‌دهد</li>
                            <li>• بعد از وارد کردن ۳ حرف، دکمه "کافی است" ظاهر می‌شود تا بتوانید ادامه دهید</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    

                    
                    {/* Postcode Suggestions */}
                    {showPostcodeSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingPostcodes ? (
                          <div className="p-4 text-center text-gray-500">
                            {translations.searching}
                          </div>
                        ) : postcodeSuggestions.length > 0 ? (
                          postcodeSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handlePostcodeSelect(suggestion)}
                              className="w-full px-4 py-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-gray-900">
                                {suggestion.postcode}
                              </div>
                              <div className="text-sm text-gray-500">
                                {suggestion.district}, {suggestion.admin_district}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            {translations.noResults}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Use My Location Button */}
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaLocationArrow className="w-4 h-4" />
                    <span>
                      {isLoadingLocation ? translations.loading : translations.useMyLocation}
                    </span>
                  </button>

                  {/* Address Display */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {translations.address}:
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.address || "آدرس انتخاب نشده"}
                    </div>
                    {formData.postcode && (
                      <div className="text-xs text-gray-500 mt-1">
                        کد پستی: {formData.postcode}
                      </div>
                    )}
                  </div>

                  {/* Map Display */}
                  <div className="h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                    {formData.latitude && formData.longitude ? (
                      <div className="h-full relative">
                        {/* Embedded Google Maps */}
                        <iframe
                          key={mapKey}
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${formData.latitude},${formData.longitude}&zoom=15`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="موقعیت پروژه"
                        />
                        
                        {/* Overlay with coordinates */}
                        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
                          <div className="font-medium text-gray-700">مختصات:</div>
                          <div className="text-gray-600">
                            عرض: {parseFloat(formData.latitude).toFixed(6)}
                          </div>
                          <div className="text-gray-600">
                            طول: {parseFloat(formData.longitude).toFixed(6)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <FaMap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">
                            برای نمایش نقشه، کد پستی را انتخاب کنید
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            یا از دکمه "استفاده از موقعیت من" استفاده کنید
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Floor Plan Analysis */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  تحلیل هوشمند نقشه کف
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FaBrain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        تحلیل خودکار نقشه با هوش مصنوعی
                      </h3>
                      <p className="text-gray-600 mb-4">
                        نقشه کف خود را آپلود کنید تا به صورت خودکار اتاق‌ها، مساحت‌ها و ابعاد تشخیص داده شوند.
                        از OCR، تشخیص اشیاء و GPT-4 Vision استفاده می‌شود.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FaEye className="w-4 h-4 text-blue-600" />
                          <span>تشخیص متن و اعداد</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FaBrain className="w-4 h-4 text-purple-600" />
                          <span>تشخیص شکل اتاق‌ها</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FaCheck className="w-4 h-4 text-green-600" />
                          <span>تحلیل هوشمند</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Upload */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                  <FaBrain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2 font-medium">
                    نقشه کف را برای تحلیل هوشمند آپلود کنید
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    فرمت‌های پشتیبانی شده: PNG، JPG، PDF، DXF
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    حداکثر اندازه فایل: 10 مگابایت
                  </p>
                  
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf,.dxf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAIAnalysis(file);
                      }
                    }}
                    className="hidden"
                    id="ai-file-upload"
                    disabled={isAnalyzing}
                  />
                  <label
                    htmlFor="ai-file-upload"
                    className={`inline-flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                      isAnalyzing 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>در حال تحلیل...</span>
                      </>
                    ) : (
                      <>
                        <FaBrain className="w-4 h-4" />
                        <span>تحلیل هوشمند نقشه</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Regular File Upload */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    آپلود معمولی فایل‌ها
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {translations.dragDrop}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      فرمت‌های پشتیبانی شده: PNG، JPG، PDF
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {translations.maxFileSize}
                    </p>
                    
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <FaUpload className="w-4 h-4 ml-2" />
                      {translations.uploadFile}
                    </label>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                        <FaUpload className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {file.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} مگابایت
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 space-x-reverse">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaSave className="w-4 h-4" />
                  <span>
                    {isSubmitting ? translations.loading : translations.submit}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>{translations.cancel}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {translations.addNewRoom}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.roomName}
              </label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.enterRoomName}
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={handleAddCustomRoom}
                disabled={!newRoomName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {translations.saveRoom}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowRoomModal(false);
                  setNewRoomName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {translations.cancelRoom}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIAnalysis && aiAnalysisFile && (
        <AIAnalysis
          file={aiAnalysisFile}
          onAnalysisComplete={handleAIAnalysisComplete}
          onCancel={handleAIAnalysisCancel}
        />
      )}
    </div>
  );
} 