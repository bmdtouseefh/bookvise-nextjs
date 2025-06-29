
"use client"
import React, { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Sparkles, Heart, Target, Star, Zap, Loader2, Info } from "lucide-react";

// Mock image for demonstration
const ni = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23f3f4f6'/%3E%3Ctext x='150' y='225' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'%3EBook Cover%3C/text%3E%3C/svg%3E";


// Constants
const BRAND_CONFIG = {
  name: "BookVise",
  tagline: "by TweakAI",
  description: "Discover your next great read with AI-powered recommendations tailored to your emotions and goals."
};

const HERO_FEATURES = [
  { icon: Star, label: "Personalized", color: "text-purple-600" },
  { icon: Sparkles, label: "Goal-Based", color: "text-pink-600" },
  { icon: Heart, label: "Emotion-Based", color: "text-indigo-600" }
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: Heart,
    title: "Share Your Feelings",
    description: "Tell us about your current emotional state and what's on your mind",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Target,
    title: "Define Your Goals", 
    description: "Describe what you want to achieve or learn through reading",
    gradient: "from-pink-500 to-indigo-500"
  },
  {
    icon: Zap,
    title: "Get Recommendations",
    description: "Receive personalized book suggestions powered by advanced AI",
    gradient: "from-indigo-500 to-purple-500"
  }
];

const BOOKS_PER_LOAD = 10; // Number of books to load at a time

// Utility Components
const Logo = () => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <BookOpen className="h-8 w-8 text-purple-600" />
      <Sparkles className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
    </div>
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {BRAND_CONFIG.name}
      </h1>
      <p className="text-xs text-gray-500 -mt-1">{BRAND_CONFIG.tagline}</p>
    </div>
  </div>
);

const GradientButton = ({ onClick, children, className = "", disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
  </button>
);

const FormTextarea = ({ label, placeholder, icon: Icon, borderColor, value, onChange, onFocus, disabled }) => (
  <div className="space-y-4">
    <div className={`flex items-center space-x-3 ${borderColor}`}>
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
    <textarea 
      className={`w-full h-32 p-4 bg-white/70 border border-${borderColor.split('-')[1]}-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${borderColor.split('-')[1]}-400 focus:border-transparent transition-all
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
    />
  </div>
);

const FeatureBadge = ({ icon: Icon, label, color }) => (
  <div className={`flex items-center space-x-2 ${color}`}>
    <Icon className="h-5 w-5 fill-current" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const StepCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="text-center">
    <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ${className}`}>
    {children}
  </div>
);

// Main Components
const Navbar = () => (
  <nav className="w-full sticky top-0 bg-white/70 backdrop-blur-md z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />
      </div>
    </div>
  </nav>
);

const HeroSection = ({ hasBooks }) => (
  <div className={`relative transition-all duration-1000 ease-in-out ${hasBooks ? 'pt-10 pb-16' : 'pt-20 pb-32'}`}>
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="mb-8">
        <h1 className={`font-bold mb-6 transition-all duration-1000 ease-in-out ${hasBooks ? 'text-3xl md:text-4xl' : 'text-5xl md:text-7xl'}`}>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Find Your Next
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Great Read
          </span>
        </h1>
        <p className={`text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ease-in-out ${hasBooks ? 'text-base' : 'text-xl'}`}>
          Discover books that resonate with your emotions and align with your goals through our AI-powered recommendation system
        </p>
      </div>
      
      <div className={`flex justify-center items-center space-x-8 transition-all duration-1000 ease-in-out ${hasBooks ? 'mb-6' : 'mb-12'}`}>
        {HERO_FEATURES.map((feature) => (
          <FeatureBadge key={feature.label} {...feature} />
        ))}
      </div>
    </div>
  </div>
);

const BookCard = ({ title, imageUrl, description = "" }) => (
  <div className="bg-white/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.015] transition duration-200 flex flex-col h-3/4">
    <div className="aspect-[2/3] w-full overflow-hidden relative">
      <img 
        src={imageUrl || ni}
        alt={title}
        className="object-cover w-full h-full"
        onError={(e) => { e.target.onerror = null; e.target.src = ni; }}
      />
    </div>

    <div className="p-4 flex flex-col justify-between flex-grow">
      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 line-clamp-3 mb-2">{description}</p>
      )}
      <a 
        href={`https://www.amazon.com/s?k=${encodeURIComponent(title)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-auto bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition"
      >
        View on Amazon
      </a>
    </div>
  </div>
);

const BookListDisplay = ({ books, isLoading, errorMessage, loadMore, hasMore }) => {
  const booksRef = useRef(null);

  // Scroll to books section when books are loaded
  useEffect(() => {
    if (books.length > 0 && booksRef.current) {
      const timeout = setTimeout(() => {
        booksRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 500); // Small delay to allow hero section animation to start

      return () => clearTimeout(timeout);
    }
  }, [books.length > 0]);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Summoning your perfect reads...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative flex items-center space-x-3 max-w-2xl mx-auto my-8">
        <Info className="h-5 w-5 flex-shrink-0" />
        <div>
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return null; // Don't show anything if no books
  }

  return (
    <div ref={booksRef} className="mt-12 scroll-mt-24">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Your Personalized Recommendations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8">
        {books.map((book, index) => (
          <BookCard key={book.id || index} title={book.title} imageUrl={book.imageUrl} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <GradientButton onClick={loadMore} className="mx-auto">
            Load More Books
          </GradientButton>
        </div>
      )}
    </div>
  );
};

const RecommendationForm = ({ onBooksLoaded }) => {
  const [moodInput, setMoodInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [activeInput, setActiveInput] = useState(null); // 'mood', 'goal', or null
  const [books, setBooks] = useState([]); // Stores enriched book objects
  const [displayedBooksCount, setDisplayedBooksCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const displayedBooks = books.slice(0, displayedBooksCount);
  const hasMoreBooks = displayedBooksCount < books.length;

  // Notify parent when books are loaded
  useEffect(() => {
    onBooksLoaded(books.length > 0);
  }, [books.length, onBooksLoaded]);

  // Function to load more books
  const loadMoreBooks = useCallback(() => {
    setDisplayedBooksCount(prevCount => Math.min(prevCount + BOOKS_PER_LOAD, books.length));
  }, [books]);

  // Handle input changes and active input logic
  const handleMoodChange = (e) => {
    setMoodInput(e.target.value);
    if (e.target.value !== "") {
      setGoalInput(""); // Clear other input when this one is active
      setActiveInput('mood');
    } else if (goalInput === "") {
      setActiveInput(null);
    }
  };

  const handleGoalChange = (e) => {
    setGoalInput(e.target.value);
    if (e.target.value !== "") {
      setMoodInput(""); // Clear other input when this one is active
      setActiveInput('goal');
    } else if (moodInput === "") {
      setActiveInput(null);
    }
  };

  // Function to fetch details for a single book from Google Books API
  const fetchBookDetails = async (title) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1&langRestrict=en`
      );
      if (!response.ok) {
        throw new Error(`Google Books API HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0];
        const imageUrl = bookInfo.volumeInfo.imageLinks?.thumbnail || bookInfo.volumeInfo.imageLinks?.smallThumbnail;
        return {
          id: bookInfo.id,
          title: bookInfo.volumeInfo.title,
          imageUrl: imageUrl
          // You can extract more details like author, description etc. if needed
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching details for "${title}" from Google Books API:`, error);
      return null; // Return null if fetching details fails for this book
    }
  };

  const handleSubmit = async () => {
    setBooks([]); // Clear previous books
    setDisplayedBooksCount(0); // Reset display count
    setErrorMessage("");
    setIsLoading(true);

    let apiUrl = "";
    let queryValue = "";

    if (activeInput === 'mood' && moodInput.trim()) {
      apiUrl = `https://tweakai.xyz/api/getbooksfeel?value=${encodeURIComponent(moodInput.trim())}`;
      queryValue = moodInput.trim();
    } else if (activeInput === 'goal' && goalInput.trim()) {
      apiUrl = `https://tweakai.xyz/api/getbookgoal?value=${encodeURIComponent(goalInput.trim())}`;
      queryValue = goalInput.trim();
    } else {
      setErrorMessage("Please enter either your mood or your goal to get recommendations.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch book titles from your backend API
      console.log(apiUrl);
      
      let backendResponse = await fetch(apiUrl);
      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Backend HTTP error! status: ${backendResponse.status} - ${errorText}`);

      }

      
      let titlesFromBackend = await backendResponse.json();
      titlesFromBackend = JSON.parse(titlesFromBackend); // This is like [{"title": "Rust Cookbook"}, ...]
 
      if (!Array.isArray(titlesFromBackend) || titlesFromBackend.length === 0) {
          setErrorMessage("The AI did not suggest any books for your query. Please try a different one.");
          setIsLoading(false);
          return;
      }

      // 2. Fetch detailed book information from Google Books API
      const fetchedBookDetails = await Promise.all(
        titlesFromBackend.map(item => fetchBookDetails(item.title))
      );

      // 3. Filter out nulls and ensure uniqueness by ID
      let enrichedAndUniqueBooks = fetchedBookDetails.filter(book => book !== null);
      const seenIds = new Set();
      enrichedAndUniqueBooks = enrichedAndUniqueBooks.filter(book => {
        if (book.id && !seenIds.has(book.id)) {
          seenIds.add(book.id);
          return true;
        }
        return false;
      });
      
      setBooks(enrichedAndUniqueBooks);
      setDisplayedBooksCount(BOOKS_PER_LOAD); // Display initial batch
      
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setErrorMessage(`Failed to get recommendations: ${error.message}. Please check your backend and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled = isLoading || (!moodInput.trim() && !goalInput.trim());

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Book</h3>
            <p className="text-gray-600">Tell us how you're feeling OR what you want to achieve (one at a time)</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FormTextarea
              label="How are you feeling?"
              placeholder="Describe your current mood, emotions, or what's on your mind..."
              icon={Heart}
              borderColor="text-purple-600"
              value={moodInput}
              onChange={handleMoodChange}
              onFocus={() => {
                if (!moodInput.trim()) {
                  setGoalInput(""); // Clear goal input if mood is focused and empty
                }
                setActiveInput('mood');
              }}
              disabled={activeInput === 'goal' && goalInput.trim() !== ""} // Disable if goal has input
            />
            <FormTextarea
              label="What are your goals?"
              placeholder="What do you want to learn, achieve, or experience through reading?"
              icon={Target}
              borderColor="text-pink-600"
              value={goalInput}
              onChange={handleGoalChange}
              onFocus={() => {
                if (!goalInput.trim()) {
                  setMoodInput(""); // Clear mood input if goal is focused and empty
                }
                setActiveInput('goal');
              }}
              disabled={activeInput === 'mood' && moodInput.trim() !== ""} // Disable if mood has input
            />
          </div>
          
          <div className="mt-8 text-center">
            <GradientButton onClick={handleSubmit} disabled={isSubmitDisabled}>
              <span className="flex items-center space-x-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Zap className="h-5 w-5 group-hover:animate-pulse" />
                )}
                <span>{isLoading ? "Getting Recommendations..." : "Get My Recommendations"}</span>
              </span>
            </GradientButton>
          </div>
        </GlassCard>
      </div>

      <BookListDisplay 
        books={displayedBooks} 
        isLoading={isLoading} 
        errorMessage={errorMessage} 
        loadMore={loadMoreBooks}
        hasMore={hasMoreBooks}
      />
    </>
  );
};

const HowItWorksSection = ({ hasBooks }) => (
  <section className={`py-24 transition-all duration-1000 ease-in-out ${hasBooks ? 'mt-8' : 'mt-20'}`}>
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How BookVise Works
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our advanced AI understands your emotions and aspirations to deliver perfectly tailored book recommendations
        </p>
      </div>
      
      <GlassCard className="p-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
        
        <AIInfoSection />
      </GlassCard>
    </div>
  </section>
);

const AIInfoSection = () => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Powered by Advanced Gemini AI
        </h3>
        <div className="space-y-4 text-gray-700">
          <p>
            At <strong>{BRAND_CONFIG.name}</strong>, we harness cutting-edge artificial intelligence to understand the subtle nuances of your emotional state and personal aspirations. Our system goes beyond simple genre matching to deliver truly personalized recommendations.
          </p>
          <p>
            The Gemini API analyzes your input through sophisticated natural language processing, interpreting not just what you say, but how you feel. This deep contextual understanding enables us to recommend books that will genuinely resonate with your current needs and future goals.
          </p>
          <p>
            Whether you're seeking inspiration during challenging times, looking for motivation to achieve your dreams, or simply want to explore new perspectives, <strong>{BRAND_CONFIG.name}</strong> connects you with the perfect literary companion for your journey.
          </p>
          {/* <DisclaimerNote /> */}
        </div>
      </div>
    </div>
  </div>
);

const DisclaimerNote = () => (
  <div className="bg-white/50 rounded-lg p-4 mt-6">
    <p className="text-sm text-gray-600">
      <strong>Note:</strong> This platform uses affiliate links to Amazon, which may earn a commission to support the website while helping you discover amazing books at no extra cost.
    </p>
  </div>
);

const Footer = () => (
  <footer className=" w-full bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <FooterBrand />
      </div>
      <FooterCopyright />
    </div>
  </footer>
);

const FooterBrand = () => (
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <BookOpen className="h-6 w-6" />
      <span className="text-xl font-bold">{BRAND_CONFIG.name}</span>
    </div>
    <p className="text-purple-200 text-sm">
      {BRAND_CONFIG.description}
    </p>
  </div>
);

const FooterCopyright = () => (
  <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-300 text-sm">
    <p>&copy; 2025 {BRAND_CONFIG.name} {BRAND_CONFIG.tagline}. All rights reserved.</p>
  </div>
);

const FloatingElements = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-pulse"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

// Main App Component
const App = () => {
  const [hasBooks, setHasBooks] = useState(false);

  const handleBooksLoaded = useCallback((booksExist) => {
    setHasBooks(booksExist);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden font-inter">
      <FloatingElements />
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection hasBooks={hasBooks} />
        
        <div className="max-w-7xl mx-auto px-6 -mt-20">
          <RecommendationForm onBooksLoaded={handleBooksLoaded} />
        </div>
        
        <HowItWorksSection hasBooks={hasBooks} />
        <Footer />
      </div>
    </div>
  );
};

export default App;

