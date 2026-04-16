// StepProgress.jsx — Dot-based step progress indicator for multi-step forms.
// Shows students how many steps remain in the experience.

export default function StepProgress({ totalSteps, currentStep }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {/* Create one dot for each step */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full ${
            index + 1 === currentStep ? "bg-gray-900" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
