import React, { useState } from 'react';
import { Exercise } from '../../types/training';
import { Dumbbell, Clock, AlertCircle, X, Edit2, Check, Video, Upload, Play, Eye, EyeOff, ArrowRight, Info, Loader } from 'lucide-react';

interface ExerciseEditorProps {
  exercise: Exercise;
  onUpdate: (updatedExercise: Exercise) => void;
  onDelete: () => void;
}

export const ExerciseEditor: React.FC<ExerciseEditorProps> = ({
  exercise,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState(exercise);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || '');
  const [showVideo, setShowVideo] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const handleSave = () => {
    onUpdate(editedExercise);
    setIsEditing(false);
  };

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('/').pop() 
          : new URLSearchParams(urlObj.search).get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const handleVideoSave = () => {
    if (!videoUrl.trim()) return;
    
    const embedUrl = getEmbedUrl(videoUrl);
    if (!embedUrl) {
      alert('נא להזין קישור תקין של YouTube או Vimeo');
      return;
    }

    setIsVideoLoading(true);

    // Simulate loading for better user experience
    setTimeout(() => {
      onUpdate({ ...exercise, videoUrl: embedUrl });
      setShowVideoInput(false);
      setIsVideoLoading(false);
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-5 shadow-lg border border-gray-600/60 hover:border-purple-500/60 transition-all duration-300">
      {isEditing ? (
        /* Editing View - Redesigned for better UX */
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 mr-3">
              <input
                type="text"
                value={editedExercise.name}
                onChange={(e) => setEditedExercise({ ...editedExercise, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-500 rounded-xl font-medium bg-gray-700/80 text-white shadow-inner focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                placeholder="שם התרגיל"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="p-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-md transform hover:scale-105 border-b-2 border-green-800"
                title="שמור"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedExercise(exercise);
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md transform hover:scale-105 border-b-2 border-red-800"
                title="בטל"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Exercise parameters in a grid layout */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-200">
                <div className="w-6 h-6 flex items-center justify-center bg-purple-900/80 rounded-lg shadow-inner">
                  <span className="text-sm text-purple-200">#</span>
                </div>
                <span>סטים:</span>
              </label>
              <input
                type="text"
                value={editedExercise.sets.replace(' sets', '')}
                onChange={(e) => setEditedExercise({ ...editedExercise, sets: `${e.target.value} sets` })}
                className="w-full px-3 py-2.5 border-2 border-purple-700/50 bg-gray-800/60 rounded-xl text-base text-white focus:border-purple-500 focus:ring focus:ring-purple-800/30 shadow-inner"
                placeholder="מספר"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-200">
                <div className="w-6 h-6 flex items-center justify-center bg-green-900/80 rounded-lg shadow-inner">
                  <span className="text-sm text-green-200">#</span>
                </div>
                <span>חזרות:</span>
              </label>
              <input
                type="text"
                value={editedExercise.reps.replace(' reps', '')}
                onChange={(e) => setEditedExercise({ ...editedExercise, reps: `${e.target.value} reps` })}
                className="w-full px-3 py-2.5 border-2 border-green-700/50 bg-gray-800/60 rounded-xl text-base text-white focus:border-green-500 focus:ring focus:ring-green-800/30 shadow-inner"
                placeholder="טווח"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-200">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-900/80 rounded-lg shadow-inner">
                  <Clock className="h-3.5 w-3.5 text-blue-200" />
                </div>
                <span>מנוחה (שניות):</span>
              </label>
              <input
                type="text"
                value={editedExercise.rest.replace(' seconds rest', '')}
                onChange={(e) => setEditedExercise({ ...editedExercise, rest: `${e.target.value} seconds rest` })}
                className="w-full px-3 py-2.5 border-2 border-blue-700/50 bg-gray-800/60 rounded-xl text-base text-white focus:border-blue-500 focus:ring focus:ring-blue-800/30 shadow-inner"
                placeholder="שניות"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-gray-200">
              <div className="w-6 h-6 flex items-center justify-center bg-amber-900/80 rounded-lg shadow-inner">
                <Info className="h-3.5 w-3.5 text-amber-200" />
              </div>
              <span>הנחיות לביצוע:</span>
            </label>
            <textarea
              value={editedExercise.instructions || ''}
              onChange={(e) => setEditedExercise({ ...editedExercise, instructions: e.target.value })}
              className="w-full px-3 py-2.5 border-2 border-amber-700/50 bg-gray-800/60 rounded-xl text-base h-24 resize-none text-white focus:border-amber-500 focus:ring focus:ring-amber-800/30 shadow-inner"
              placeholder="הוסף הנחיות לביצוע התרגיל (לא חובה)"
            />
          </div>
        </div>
      ) : (
        /* View Mode - Redesigned */
        <div>
          <div className="flex justify-between items-start">
            {/* Exercise Title with Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg shadow-md transform transition-transform duration-300 group-hover:rotate-12">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-lg text-white">{exercise.name}</h4>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {exercise.videoUrl && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className={`px-3 py-2 rounded-xl ${showVideo ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'} transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-md`}
                >
                  {showVideo ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>הסתר סרטון</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>הצג סרטון</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setShowVideoInput(true)}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors duration-200 shadow-md"
                title={exercise.videoUrl ? 'ערוך סרטון' : 'הוסף סרטון'}
              >
                <Video className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-colors duration-200 shadow-md"
                title="ערוך תרגיל"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors duration-200 shadow-md"
                title="מחק תרגיל"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Redesigned exercise details in a single row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-r from-purple-900/60 to-purple-800/60 p-3 rounded-xl shadow-md border border-purple-700/40">
              <div className="text-xs text-gray-300 mb-1 flex items-center gap-1.5">
                <div className="w-4 h-4 flex items-center justify-center bg-purple-800 rounded-full">
                  <span className="text-[10px] text-white">#</span>
                </div>
                <span>סטים</span>
              </div>
              <div className="font-semibold text-lg text-white">{exercise.sets.replace('sets', '')}</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/60 to-green-800/60 p-3 rounded-xl shadow-md border border-green-700/40">
              <div className="text-xs text-gray-300 mb-1 flex items-center gap-1.5">
                <div className="w-4 h-4 flex items-center justify-center bg-green-800 rounded-full">
                  <span className="text-[10px] text-white">#</span>
                </div>
                <span>חזרות</span>
              </div>
              <div className="font-semibold text-lg text-white">{exercise.reps.replace('reps', '')}</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/60 to-blue-800/60 p-3 rounded-xl shadow-md border border-blue-700/40">
              <div className="text-xs text-gray-300 mb-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-blue-300" />
                <span>מנוחה (שניות)</span>
              </div>
              <div className="font-semibold text-lg text-white">{exercise.rest.replace('seconds rest', '')}</div>
            </div>
          </div>

          {/* Instructions - nicer styling */}
          {exercise.instructions && (
            <div className="mt-4 bg-amber-900/30 p-4 rounded-xl border border-amber-700/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-400" />
              <div>
                <div className="font-medium mb-1.5 text-amber-200 text-sm">הנחיות לביצוע התרגיל:</div>
                <p className="text-amber-100/90">{exercise.instructions}</p>
              </div>
            </div>
          )}

          {/* Success message - improved */}
          {showUploadSuccess && (
            <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-green-900/60 to-green-800/60 text-white p-3 rounded-xl text-sm border border-green-700/50 shadow-md animate-fade-in-up">
              <div className="p-1 bg-green-700 rounded-full">
                <Check className="h-4 w-4" />
              </div>
              <span className="font-medium">הסרטון נוסף בהצלחה!</span>
            </div>
          )}

          {/* Video display - better styling */}
          {exercise.videoUrl && showVideo && (
            <div className="mt-4 rounded-xl overflow-hidden border-2 border-blue-600 shadow-xl">
              <div className="relative pt-[56.25%] bg-black">
                <iframe
                  src={exercise.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video URL Input Modal - Redesigned */}
      {showVideoInput && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-up backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl border-2 border-blue-500 overflow-hidden">
            <div className="p-5 border-b border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl shadow-md">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">הוספת סרטון הדגמה</h3>
                <p className="text-gray-300 text-sm">הוסף סרטון כדי להראות למתאמן איך לבצע את התרגיל נכון</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-medium text-gray-200">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-900/80 rounded-lg">
                    <ArrowRight className="h-3.5 w-3.5 text-blue-200" />
                  </div>
                  <span>קישור לסרטון:</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="הכנס קישור YouTube או Vimeo..."
                  className="w-full p-3 border-2 border-blue-700/50 bg-gray-700/60 rounded-xl text-white focus:border-blue-500 focus:ring focus:ring-blue-500/30 transition-colors duration-200 shadow-inner"
                />
                <p className="text-xs text-gray-400">
                  לדוגמה: https://www.youtube.com/watch?v=XXXX
                </p>
              </div>
              
              {/* Example info */}
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/30 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-100">
                  הוספת סרטון תעזור למתאמן להבין את צורת הביצוע הנכונה של התרגיל ותמנע פציעות.
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowVideoInput(false)}
                  className="px-5 py-2.5 text-gray-300 hover:text-white font-medium transition-colors duration-200"
                >
                  ביטול
                </button>
                <button
                  onClick={handleVideoSave}
                  disabled={!videoUrl.trim() || isVideoLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md border-b-2 border-blue-800 flex items-center gap-2"
                >
                  {isVideoLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>מעלה...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>הוסף סרטון</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};