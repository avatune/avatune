/// A layer of the avatar that can carry an item and a colour.
///
/// Raw values match the TypeScript `AvatarPartCategory` union so that
/// configurations serialised by the web packages decode unchanged.
public enum AvatarPartCategory: String, CaseIterable, Sendable, Codable {
    case accessories
    case glasses
    case hats
    case hair
    case faceDetails
    case body
    case ears
    case eyebrows
    case eyes
    case faceHair
    case forelock
    case head
    case mouth
    case neck
    case nose

    /// The `<category>Color` key used by `AvatarConfig` on the TypeScript side.
    public var colorKey: String { "\(rawValue)Color" }
}
