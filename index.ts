/* https://nickdrane.com/build-your-own-regex/ */

import "infinitelytyped"; // https://github.com/InfinitelyTyped/InfinitelyTyped/

type Slice<S extends string, Start extends number, End extends number> = InfinitelyTyped.Strings.Slice<S, Start, End>;

type Increment<X extends number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65][X];

type MatchOne<
    Pattern extends string,
    Text extends string,
> = Pattern extends ""
    ? true
    : Text extends ""
        ? false
        : Pattern extends "."
            ? true
            : Pattern extends Text
                ? true 
                : false;

type Match<
    Pattern extends string,
    Text extends string,
> = Pattern extends ""
    ? true
    : Pattern extends "$"
        ? Text extends ""
            ? true
            : Pattern[1] extends "?"
                ? MatchOptional<Pattern, Text>
                : Pattern[1] extends "*"
                    ? MatchOptionalRepeat<Pattern, Text>
                    : Pattern[0] extends "("
                        ? MatchGroup<Pattern, Text>
                        : Pattern extends `${infer PFirst}${infer PRest}`
                            ? Text extends `${infer TFirst}${infer TRest}`
                                ? MatchOne<PFirst, TFirst> extends true
                                    ? Match<PRest, TRest>
                                    : false
                                : false
                            : never
        : Pattern[1] extends "?"
            ? MatchOptional<Pattern, Text>
            : Pattern[1] extends "*"
                ? MatchOptionalRepeat<Pattern, Text>
                : Pattern[0] extends "("
                    ? MatchGroup<Pattern, Text>
                    : Pattern extends `${infer PFirst}${infer PRest}`
                        ? Text extends `${infer TFirst}${infer TRest}`
                            ? MatchOne<PFirst, TFirst> extends true
                                ? Match<PRest, TRest>
                                : false
                            : false
                        : never;

type MatchOptional<
    Pattern extends string,
    Text extends string,
> = Pattern extends `${infer PFirst}${infer PRest}`
    ? Text extends `${infer TFirst}${infer TRest}`
        ? MatchOne<PFirst, TFirst> extends true
            ? PRest extends `${infer _}${infer PRestRest}`
                ? Match<PRestRest, TRest> extends true
                    ? true
                    : Match<PRestRest, Text>
                : false
            : false
        : false
    : false;

type MatchOptionalRepeat<
    Pattern extends string,
    Text extends string,
> = Pattern extends `${infer PFirst}${infer PRest}`
    ? Text extends `${infer TFirst}${infer TRest}`
        ? MatchOne<PFirst, TFirst> extends true
            ? Match<Pattern, TRest> extends true
                ? true
                : PRest extends `${infer _}${infer PRestRest}`
                    ? Match<PRestRest, Text>
                    : false
            : false
        : false
    : false;

type MatchGroup<
    Pattern extends string,
    Text extends string,
> = InfinitelyTyped.Strings.IndexOf<Pattern, ")"> extends infer GroupEnd
    ? Slice<Pattern, 1, GroupEnd> extends infer GroupPattern
        ? Pattern[Increment<GroupEnd>] extends "?"
            ? Slice<Pattern, Increment<Increment<GroupEnd>>> extends infer RemainingPattern
                ? Match<GroupPattern, Slice<Text, 0, GroupPattern["length"]>> extends true
                    ? Match<RemainingPattern, Slice<Text, GroupPattern["length"]>> extends true
                        ? true
                        : Match<RemainingPattern, Text>
                    : false
                : never
            : Pattern[Increment<GroupEnd>] extends "*"
                ? Slice<Pattern, Increment<Increment<GroupEnd>>> extends infer RemainingPattern
                    ? Match<GroupPattern, Slice<Text, 0, GroupPattern["length"]>> extends true
                        ? Match<Pattern, Slice<Text, GroupPattern["length"]>> extends true
                            ? true
                            : Match<RemainingPattern, Text>
                        : false
                    : never
                : Slice<Pattern, Increment<GroupEnd>> extends infer RemainingPattern
                    ? Match<GroupPattern, Slice<0, GroupPattern["length"]>> extends true
                        ? Match<RemainingPattern, Slice<Text, GroupPattern["length"]>>
                        : false
                    : never
        : never
    : never;

type Regex<
    Pattern extends string,
    Text extends string,
> = Pattern extends `${infer PFirst}${infer PRest}`
    ? PFirst extends "^"
        ? Match<PRest, Text>
        : Match<`.*${Pattern}`, Text>
    : Match<`.*${Pattern}`, Text>;
